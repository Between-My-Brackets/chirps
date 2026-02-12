import {db} from "../index.js";
import { NewUser, users } from "../schema.js";
import {eq} from "drizzle-orm";


export async function createUser(user: NewUser){
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();

    return result;
}


export async function getUserByEmail(email:string){
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    return user;
}


export async function deleteAllUsers(){
    await db.delete(users);
}


export async function updateUserById(
    userId: string,
    email: string,
    passwordHash: string
){
    const [updatedUser] = await db
        .update(users)
        .set({
            email: email,
            hashed_password: passwordHash,
            updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning({
            id: users.id,
            email: users.email,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
            isChirpyRed: users.isChirpyRed
        });
    return updatedUser;
}

export async function upgradeUserToChirpyRed(userId: string){
    const [updatedUser] = await db
        .update(users)
        .set({
            isChirpyRed: true,
            updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning({
            id: users.id,
            email: users.email,
            isChirpyRed: users.isChirpyRed
        })
    return updatedUser;
}