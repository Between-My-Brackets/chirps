import {db} from "../index.js";
import {chirps, users} from "../schema.js";
import {asc, eq, and, desc} from "drizzle-orm";

export async function getAllChirps(authorId?: string, sort?: "asc" | "desc"){
    const orderBy = sort === "desc" ? desc(chirps.createdAt) : asc(chirps.createdAt);
    if (authorId) {
        const allChirps = await db
            .select()
            .from(chirps)
            .where(eq(chirps.userId, authorId))
            .orderBy(orderBy);
        return allChirps;
    } else {
        const allChirps = await db
            .select()
            .from(chirps)
            .orderBy(orderBy);
        return allChirps;
    }
}

//the sql equivalent of the above is :
// SELECT *
// FROM chirps
// ORDER BY created_at ASC;

;
export async function getChirpById(chirpId: string){
    const [chirp] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId))
        .limit(1);
    return chirp;
}


export async function deleteChirpByIdAndAuthor(chirpId: string, authorId: string) {
    const [deleteChirp] = await db
        .delete(chirps)
        .where(and(eq(chirps.userId, authorId), eq(chirps.id, chirpId)))
        .returning();
    return deleteChirp;
}