import {apiConfig} from "../config.js";
import {Request, Response, NextFunction} from "express";

export function middlewareMetricsInc(req: Request, res: Response, next:NextFunction){
    apiConfig.fileserversHits++;
    next();
}