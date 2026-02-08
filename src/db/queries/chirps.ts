import {db} from "../index.js";
import {chirps} from "../schema.js";
import {asc} from "drizzle-orm";

export async function getAllChirps(){
    const allChirps = await db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));

    return allChirps;
}