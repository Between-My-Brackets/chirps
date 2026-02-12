import {Request, Response, NextFunction} from "express";
import { respondWithError } from "../utils/response.utils.js";
import {CustomError} from "../errors/customErrors.js";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
)=> {
    if(err instanceof CustomError){
        return res.status(err.statusCode).send({error: err.serializeErrors()[0].message});
    }

    res.status(500).send({
        errors: [
            {
                message: "Something went wrong"
            }
        ],
    });
};