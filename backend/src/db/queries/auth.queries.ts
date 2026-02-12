// src/db/queries/auth.queries.ts
import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
import { eq } from "drizzle-orm";

export async function storeRefreshToken(token: string, userId: string, expiresAt: Date) {
	return db.insert(refreshTokens).values({
		token,
		userId,
		expiresAt,
	});
}

export async function getRefreshToken(token: string) {
	const result = await db
		.select()
		.from(refreshTokens)
		.where(eq(refreshTokens.token, token));
	return result[0];
}

export async function revokeRefreshToken(token: string) {
	return db
		.update(refreshTokens)
		.set({ revokedAt: new Date(), updatedAt: new Date() })
		.where(eq(refreshTokens.token, token));
}
