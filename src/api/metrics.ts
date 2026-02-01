import {Request, Response, NextFunction} from "express";
import {apiConfig} from "../config.js";

export function getMetrics(req:Request, res: Response){
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(`Hits: ${apiConfig.fileserversHits}`);
}

export function resetMetrics(req: Request, res: Response){
    apiConfig.fileserversHits = 0;
    res.status(200).send();
}