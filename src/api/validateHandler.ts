import {Request, Response} from "express";
import {BadRequestError} from "../errors/badRequestError.js";


export async function validateHandler(req: Request, res:Response){
    type parameters = {
        body: string;
    };

    const params:parameters = req.body;

    const maxChirpLength = 140;

    if(params.body === undefined){
        throw new BadRequestError("Invalid request, Body is required");
    }

    if(params.body.length > maxChirpLength){
        throw new BadRequestError("Chirp is too long. Max length is 140")
    }

    const words = params.body.split(" ");

    const badWords = ["kerfuffle", "sharbert", "fornax"];
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const loweredWord = word.toLowerCase();
        if (badWords.includes(loweredWord)) {
            words[i] = "****";
        }
    }

    const cleaned = words.join(" ");

    res.status(200).json({
        cleanedBody: cleaned
    });
}