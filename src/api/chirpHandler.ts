import {Request, Response} from "express";
import {BadRequestError} from "../errors/badRequestError.js";
import { db } from "../db/index.js"
import {chirps, NewChirp} from "../db/schema.js";

export async function createChirpController(req: Request, res:Response){
    interface createChirpRequestBody{
        body: string;
        userId: string;
    }

    const {body, userId}: createChirpRequestBody = req.body;


    const maxChirpLength = 140;

    if(body === undefined || body.trim() === ""){
        throw new BadRequestError("Invalid request, Body is required and cannot be empty");
    }

    if(userId === undefined || body.trim() === ""){
        throw new BadRequestError("Invalid request, userId is required and cannot be empty");
    }

    if(body.length > maxChirpLength){
        throw new BadRequestError("Chirp is too long. Max length is 140")
    }

    const words = body.split(" ");

    const badWords = ["kerfuffle", "sharbert", "fornax"];
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const loweredWord = word.toLowerCase();
        if (badWords.includes(loweredWord)) {
            words[i] = "****";
        }
    }

    const cleaned = words.join(" ");

    const newChirpData: NewChirp = {
        body: cleaned,
        userId: userId,
    }

    const [createdChirp] = await db.insert(chirps).values(newChirpData).returning();

    if(!createdChirp){
        throw new Error("Failed to create a new chirp");
    }

    res.status(201).json({
        id: createdChirp.id,
        createdAt: createdChirp.createdAt,
        updatedAt: createdChirp.updatedAt,
        body: createdChirp.body,
        userId: createdChirp.userId
    });
}