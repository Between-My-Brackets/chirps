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

export function adminGetMetrics(req: Request, res: Response){
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${apiConfig.fileserversHits} times!</p>
  </body>
</html>`);
}

export function adminResetMetrics(req: Request, res: Response){
    apiConfig.fileserversHits = 0;
    res.status(200).send();
}