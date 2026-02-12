import { Request, Response, NextFunction } from "express";
import { upgradeUserToChirpyRed } from "../db/queries/users.queries.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { getAPIKey } from "../utils/auth.utils.js";
import { config } from "../config.js";

interface PolkaWebhookEvent {
    event: string;
    data: {
        userId: string;
    };
}

export async function polkaWebhookController(req: Request, res: Response, next: NextFunction){

    try{
        const apiKey = getAPIKey(req);
        if(apiKey !== config.polkaKey){
            return res.status(401).send("Unauthorized: Invalid API Key");

        }
    }
    catch(err){
        if(err instanceof Error){
            return res.status(401).send(`Unauthorized: ${err.message}`);
        }
        return res.status(401).send("Unauthorized: Invalid API key format")
    }

    const {event, data} = req.body as PolkaWebhookEvent;

    if(event !== "user.upgraded") {
        return res.status(204).send();
    }

    try{
        const userId = data.userId;
        if(!userId){
            return res.status(400).send("Missing userId in webhook data for user.upgraded event.");
        }

        const updatedUser = await upgradeUserToChirpyRed(userId);

        if(!updatedUser){
            throw new NotFoundError(`User with ID ${userId} not found`);
        }
        res.status(204).send();
    }
    catch(err){
        if(err instanceof NotFoundError){
            return res.status(404).send(err.message);
        }
        next(err);
    }
}