import type {Request, Response, NextFunction} from "express";
import {getUserByEmail} from "../db/queries/users.queries.js";
import {checkPasswordHash, makeJWT} from "../auth.js";
import {Omit} from "utility-types";
import {users} from "../db/schema.js";
import {config} from "../config.js";

type loginRequestBody = {
    email: string;
    password: string;
    expiresInSeconds?: number;
}

type UserResponse = Omit<typeof users.$inferSelect, "hashed_password"> & {token?: string};


export async function loginController(req: Request, res:Response) {
    const {email, password, expiresInSeconds} = req.body as loginRequestBody;

    if(!email || !password){
        res.status(400).send("Email and Password are required");
        return;
    }

    try{
        const user = await getUserByEmail(email);

        if(!user){
            return res.status(401).send("incorrect email or password");
        }

        if (!user.hashed_password || user.hashed_password === "unset") {
            console.warn(`User ${user.email} has an invalid or unset hashed_password.`);
            return res.status(401).send("incorrect email or password");
        }
        const passwordMatch = await checkPasswordHash(password, user.hashed_password);

        if(!passwordMatch){
            return res.status(401).send("incorrect email or password");
        }

        let actualExpiresInSeconds = config.jwt.tokenExpiresInSeconds;
        if (expiresInSeconds !== undefined) {
            actualExpiresInSeconds = Math.min(expiresInSeconds, config.jwt.tokenExpiresInSeconds); // Cap at max 1 hour
        }

        const token = makeJWT(user.id, actualExpiresInSeconds, config.jwt.secret)

        const userResponse: UserResponse = {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            token: token
        }
        res.status(200).json(userResponse);
    }
    catch (err){
        console.error("Login error: ",err);
        res.status(500).send("Internal server error")
    }
}