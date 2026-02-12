import type { Request, Response, NextFunction } from "express";
import { getUserByEmail } from "../db/queries/users.queries.js";
import { checkPasswordHash, makeJWT, makeRefreshToken, getBearerToken } from "../utils/auth.utils.js";
import { Omit } from "utility-types";
import { users } from "../db/schema.js";
import { config } from "../config.js";
import { storeRefreshToken, getRefreshToken, revokeRefreshToken } from "../db/queries/auth.queries.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";


type loginRequestBody = {
	email: string;
	password: string;
};

type UserResponse = Omit<typeof users.$inferSelect, "hashed_password"> & {
	token?: string;
	refreshToken?: string;
};

export async function loginController(req: Request, res: Response, next: NextFunction) {
	const { email, password } = req.body as loginRequestBody;

	if (!email || !password) {
		res.status(400).send("Email and Password are required");
		return;
	}

	try {
		const user = await getUserByEmail(email);

		if (!user) {
			return res.status(401).send("incorrect email or password");
		}

		if (!user.hashed_password || user.hashed_password === "unset") {
			console.warn(`User ${user.email} has an invalid or unset hashed_password.`);
			return res.status(401).send("incorrect email or password");
		}
		const passwordMatch = await checkPasswordHash(password, user.hashed_password);

		if (!passwordMatch) {
			return res.status(401).send("incorrect email or password");
		}

		const accessToken = makeJWT(user.id, 3600, config.jwt.secret); // Expires in 1 hour
		const refreshToken = makeRefreshToken();
		const refreshTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days
		await storeRefreshToken(refreshToken, user.id, refreshTokenExpiresAt);

		const userResponse: UserResponse = {
			id: user.id,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			email: user.email,
			isChirpyRed:user.isChirpyRed,
			token: accessToken,
			refreshToken: refreshToken,
		};
		res.status(200).json(userResponse);
	} catch (err) {
		next(err);
	}
}

export async function refreshController(req: Request, res: Response, next: NextFunction) {
	try {
		const token = getBearerToken(req);
		const dbToken = await getRefreshToken(token);

		if (!dbToken || dbToken.revokedAt || new Date() > dbToken.expiresAt) {
			throw new UnauthorizedError();
		}

		const newAccessToken = makeJWT(dbToken.userId, 3600, config.jwt.secret); // Expires in 1 hour

		res.status(200).json({ token: newAccessToken });
	} catch (err) {
		next(err);
	}
}

export async function revokeController(req: Request, res: Response, next: NextFunction) {
	try {
		const token = getBearerToken(req);
		await revokeRefreshToken(token);
		res.status(204).send();
	} catch (err) {
		next(err);
	}
}
