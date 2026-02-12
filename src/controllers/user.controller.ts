import {Request, Response} from "express";
import {NewUser, users} from "../db/schema.js";
import {createUser} from "../db/queries/users.queries.js";
import {hashPassword} from "../auth.js";
import {Omit} from "utility-types";
import { updateUserById } from "../db/queries/users.queries.js";
import { BadRequestError } from "../errors/badRequestError.js";

type createUserRequestBody = {
    email: string;
    password: string;
};

type UserResponse = Omit<typeof users.$inferSelect, "hashed_password">;

type updateUserRequestBody = {
    email?: string;
    password?: string
};



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
                email: createdUser.email,
                isChirpyRed: createdUser.isChirpyRed
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

export async function updateUserController(req: Request, res: Response) {
    if(!req.user || !req.user.id){
        throw new Error("user not authenticated");
    }

    const {email, password} = req.body as updateUserRequestBody;
    const userId = req.user.id;

    if(!email || !password){
        throw new BadRequestError("both email and password are required to update the user information");
    }

    try{
        const updatePasswordHash = await hashPassword(password);
        const updatedUser = await updateUserById(
            userId,
            email,
            updatePasswordHash
        );

        if (updatedUser) {
            const userResponse: UserResponse = {
                id: updatedUser.id,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
                email: updatedUser.email,
                isChirpyRed: updatedUser.isChirpyRed
            };
            res.status(200).json(userResponse); // Corrected this line
        } else {
            throw new Error("User not found after update attempt.");
        }
    }
    catch (err) {
        console.error("Error updating user in updateUserController: ", err);
        throw err;
    }
}