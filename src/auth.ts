import argon2 from "argon2";
import jwt, {JwtPayload} from "jsonwebtoken";
import {Request} from "express";
import crypto from "crypto";

export async function hashPassword(password: string){
    return argon2.hash(password)
}


export async function checkPasswordHash(password:string, hash: string){
    return argon2.verify(hash, password);
}


type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;


export function makeJWT(userID: string, expiresIn:number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000);
    const jwtPayload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: iat,
        exp: iat+expiresIn,
    };
    return jwt.sign(jwtPayload, secret);
}


export function validateJWT(tokenString: string, secret:string): string {
    const decode = jwt.verify(tokenString, secret) as payload;
    if(typeof decode.sub !== "string"){
        throw new Error("Invalid token");
    }
    return decode.sub;
}


export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new Error("Authorization header is missing");
    }
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
        throw new Error("Invalid Authorization header format. Expected 'Bearer TOKEN'.");
    }
    return token;
}


export function makeRefreshToken() {
    return crypto.randomBytes(32).toString("hex");
}


export function getAPIKey(req: Request): string{
    const authHeader = req.get("Authorization");
    if(!authHeader){
        throw new Error("Authorization header is missing");
    }
    const [keyType, apiKey] = authHeader.split(" ");
    if(keyType !== "ApiKey" || !apiKey){
        throw new Error("Invalid Authorization header format. Expected 'ApiKey THE_KEY_HERE'.");
    }
    return apiKey;
}