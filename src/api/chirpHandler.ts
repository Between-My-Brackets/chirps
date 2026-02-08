import {Request, Response} from "express";
import {BadRequestError} from "../errors/badRequestError.js";
import { db } from "../db/index.js"
import {chirps, NewChirp} from "../db/schema.js";
import {getAllChirps, getChirpById} from "../db/queries/chirps.js";

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

    const cleanedBody = words.join(" ");

    const newChirpData: NewChirp = {
        body: cleanedBody,
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

export async function getChirpsController(req: Request, res: Response){
    const chirps = await getAllChirps();

    const formattedChirps = chirps.map(chirp => ({
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.userId,
    }));

    res.status(200).json(formattedChirps);
}

export async function getChirpByIdController(req: Request, res: Response) {

    const { chirpId } = req.params as {chirpId: string};
    const chirp = await getChirpById(chirpId);

     if (!chirp) {
         return res.status(404).send("Chirp not found");
     }

     const formattedChirp = {
         id: chirp.id,
         createdAt: chirp.createdAt,
         updatedAt: chirp.updatedAt,
         body: chirp.body,
         userId: chirp.userId,
     };

     res.status(200).json(formattedChirp);
 }