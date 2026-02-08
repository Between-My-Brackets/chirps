import {Request, Response} from "express";
import {NewUser, users} from "../db/schema.js";
import {createUser} from "../db/queries/users.queries.js";
import {hashPassword} from "../auth.js";
import {Omit} from "utility-types";

type createUserRequestBody = {
    email: string;
    password: string;
};

type UserResponse = Omit<typeof users.$inferSelect, "hashed_password">;



export async function createUserController(req: Request, res: Response){
    const {email, password} = req.body as createUserRequestBody;

    if(!email || !password){
        res.status(400).send("Email and password are required");
        return;
    }

    const hashedPassword = await hashPassword(password);

    const newuser:NewUser = {
        email: email,
        hashed_password: hashedPassword
    };

    try{
        const createdUser = await createUser(newuser);
        if(createdUser){
            const userResponse: UserResponse ={
                id: createdUser.id,
                createdAt: createdUser.createdAt,
                updatedAt: createdUser.updatedAt,
                email: createdUser.email
            }
            res.status(201).json(userResponse);
        }else {
            res.status(409).send(`User with the email: ${email} already exists`)
        }
    }
    catch(err){
        console.error("Error creating the user: ",err);
        res.status(500).send("Internal server error.");
    }
}