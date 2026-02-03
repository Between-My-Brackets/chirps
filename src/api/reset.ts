import type {Request, Response} from "express";
import {config} from "../config.js";

export async  function handlerReset(req:Request, res:Response) {
    config.fileServerHits = 0;
    res.write("Hits are reset with 0");
    res.end();
}