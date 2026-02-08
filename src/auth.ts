import argon2 from "argon2";
import jwt, {JwtPayload} from "jsonwebtoken";

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