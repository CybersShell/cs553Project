import express from "express";
import * as jose from 'jose';
import bcrypt from 'bcrypt';
import * as schema from "../schema/schema";
import * as userService from "../services/user"
import { validateUserRequestBody, validateNameInBody } from "./middleware/auth";

export async function StartAuthController(app: express.Application) {
    app.post("/auth/register", validateUserRequestBody, validateNameInBody, registerUser);

    app.post("/auth/login", validateUserRequestBody, loginUser);
}

async function registerUser(req: express.Request, res: express.Response) {
        try {
            console.log("Registering user...");
            const user: schema.User = {
                name: req.user.name,
                email: req.user.email,
                passwordHash: await userService.hashPassword(req.body.password),
            };
            const result = await userService.createUser(user);
            if (result.rowCount && result.rowCount > 0) {
                res.json(result.rows[0]); // Return the created user
            } else {
                res.status(403).json({ error: "User exists already. Please login" }); // Return the created user
            }
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: "Internal server error"});
        }
}

async function loginUser(req: express.Request, res: express.Response) { 
    try {
        const user: schema.User = {
                name: req.user.name,
                email: req.user.email,
                // passwordHash: await userService.hashPassword(req.body.password),
            }
        const userResult = await userService.findUser(user);
        if (userResult.rowCount && userResult.rowCount > 0) {
            const isPasswordValid = await bcrypt.compare(req.user.password.toString(), userResult.rows[0].password_hash);
            if (isPasswordValid) {
                const Token = await userService.generateJWT(
                    {
                        email: userResult.rows[0].email,
                        id: userResult.rows[0].id,
                        role: userResult.rows[0].role
                    } as schema.User
                );
                res.status(200).json({token: Token});
                return;
            }
        }
        
        res.status(403).json({error: "Invalid email or password"});
    
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal server error"});
    }
}