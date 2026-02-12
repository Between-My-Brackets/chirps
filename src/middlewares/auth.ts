import { Request, Response, NextFunction } from "express";
import { validateJWT, getBearerToken } from "../utils/auth.utils.js";
import { config } from "../config.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";

declare global {
    namespace Express {
        interface Request {
            user?:{
                id: string;
            };
        }
    }
}


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = getBearerToken(req);
        const userId = validateJWT(token, config.jwt.secret);

        req.user = {id: userId};
        next();
    }
    catch(err){
        next(new UnauthorizedError("Authorization failed: Invalid or missing token"));
    }
};