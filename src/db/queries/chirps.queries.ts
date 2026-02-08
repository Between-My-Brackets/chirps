import {db} from "../index.js";
import {chirps} from "../schema.js";
import {asc, eq} from "drizzle-orm";

export async function getAllChirps(){
    const allChirps = await db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));

    return allChirps;
}

//the sql equivalent of the above is :
// SELECT *
// FROM chirps
// ORDER BY created_at ASC;


export async function getChirpById(chirpId: string){
    const [chirp] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId))
        .limit(1);
    return chirp;
}