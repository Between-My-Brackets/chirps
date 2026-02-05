import {Request, Response} from "express";
import {NewUser} from "../db/schema.js";
import {createUser} from "../db/queries/users.js";

type createUserRequestBody = {
    email: string;
};

export async function createUserController(req: Request, res: Response){
    const {email} = req.body as createUserRequestBody;

    if(!email){
        res.status(400).send("Email is required");
        return;
    }

    const newuser:NewUser = {
        email: email,
    };

    try{
        const createdUser = await createUser(newuser);
        if(createdUser){
            res.status(201).json(createdUser);
        }else {
            res.status(409).send(`User with the email: ${email} already exists`)
        }
    }
    catch(err){
        console.error("Error creating the user: ",err);
        res.status(500).send("Internal server error.");
    }
}