// src/api/login.ts
import type { Request, Response, NextFunction } from "express";
import { getUserByEmail } from "../db/queries/users.queries.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { Omit } from "utility-types";
import { users } from "../db/schema.js";
import { config } from "../config.js";
import { storeRefreshToken } from "../db/queries/auth.queries.js";

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
			token: accessToken,
			refreshToken: refreshToken,
		};
		res.status(200).json(userResponse);
	} catch (err) {
		next(err);
	}
}
