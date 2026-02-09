// src/api/refresh.ts
import { Request, Response, NextFunction } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { getRefreshToken } from "../db/queries/auth.queries.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { config } from "../config.js";

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
