import {Request, Response} from "express";
import {BadRequestError} from "../errors/badRequestError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { ForbiddenError } from "../errors/forbiddenError.js";
import { db } from "../db/index.js"
import {chirps, NewChirp} from "../db/schema.js";
import {getAllChirps, getChirpById, deleteChirpByIdAndAuthor} from "../db/queries/chirps.queries.js";

type CreateChripRequestBody = {
    body: string
}

export async function createChirpController(req: Request, res:Response){

    const {body} = req.body as CreateChripRequestBody;
    const userId = req.user?.id;

    if(!body){
        throw new BadRequestError("Chirp body is required");
    }

    const maxChirpLength = 140;

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
    let authorId: string | undefined;
    const authorIdQuery = req.query.authorId;

    if(typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }

    let sort: 'asc' | 'desc' | undefined;
    const sortQuery = req.query.sort;

    if(typeof sortQuery === "string"){
        if(sortQuery === "asc" || sortQuery === "desc"){
            sort = sortQuery;
        }else {
            return res.status(400).send("Invalid sort parameter, Must be 'asc' or 'desc'.")
        }
    }

    const chirps = await getAllChirps(authorId, sort);

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

 export async function deleteChirpController(req: Request, res: Response){
    if(!req.user || !req.user.id){
        throw new Error("User not authenticated for chirp deletion.");
    }

    const {chirpId} = req.params as {chirpId: string};
    const userId = req.user.id;

    try{
        if(!chirpId){
            throw new BadRequestError("chirpID is required.");
        }

        const existingChirp = await getChirpById(chirpId);

        if(!existingChirp){
            throw new NotFoundError();
        }

        if(existingChirp.userId !== userId){
            throw new ForbiddenError();
        }

        const deletedChirp = await deleteChirpByIdAndAuthor(chirpId, userId);

        if(!deletedChirp){
            throw new Error("Failed to delete chirp unexpectedly");
        }

        return res.status(204).send();
    }
    catch(err){
        console.error("Error deleting chirp:", err);
        throw err;
    }
 }