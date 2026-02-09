// src/api/revoke.ts
import { Request, Response, NextFunction } from "express";
import { getBearerToken } from "../auth.js";
import { revokeRefreshToken } from "../db/queries/auth.queries.js";

export async function revokeController(req: Request, res: Response, next: NextFunction) {
	try {
		const token = getBearerToken(req);
		await revokeRefreshToken(token);
		res.status(204).send();
	} catch (err) {
		next(err);
	}
}
