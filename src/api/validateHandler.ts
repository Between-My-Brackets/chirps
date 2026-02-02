import {Request, Response} from "express";

export async function validateHandler(req: Request, res:Response){
    try{
        const {body} = req.body;

        if(body === undefined){
            res.status(400).json({
                error: "Invalid request body is required"
            });
            return;
        }

        if(typeof body !== 'string'){
            res.status(400).json({
                error: "Invalid request body must be string"
            });
            return;
        }

        if(body.length > 140){
            res.status(400).json({
                error:"Chirp is too long"
            });
            return;
        }
        res.status(200).json({valid : true})
        return;
    }
    catch (error){
        res.status(500).json({
            error: "Something went wrong"
        });
        return;
    }
}