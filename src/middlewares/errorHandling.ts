import {Request, Response, NextFunction} from "express";
import {respondWithError} from "../api/json.js";

export function errorHandler(err:Error,req:Request, res:Response, next:NextFunction){
    const message= "Something went wrong on our end";

    console.log(err.message);

    respondWithError(res, 500, message)
}