import express from "express";
import {isEmail} from 'validator';
import { verifyJWT } from "../../services/user";
import { REFUSED } from "node:dns";

// This will be called for authorization on routes
export async function authenticateToken(req: express.Request, res: express.Response, next: Function) {
    try {
        const token: string | undefined | null  = req.headers.authorization?.split("Bearer ")[1];
        // console.log("Token: ", token);
        // console.log("Token: ", req.headers);
        if (!token) {
            res.status(401).json({error: "Missing authorization token: should be 'Authorization: Bearer <token>' in header"});
            return;
        }

        const decoded = await verifyJWT(token.trim());
        req.userTokenData = decoded;
        next();
    } catch (error) {
        res.status(401).json({error: "Authentication required"});
    }
}

export async function validateUserRequestBody(req: express.Request, res: express.Response, next: Function) {
    try {
        const reqBody = req.body;
        req.user = {} as any;
        if (reqBody.hasOwnProperty('email')) {
            if (!isEmail(reqBody.email)) {
                res.status(400).json({
                    status: "error",
                    message: "Invalid email address"
                });
                return
            }
        } else {
            res.status(400).json({
                status: "error",
                message: "Missing required field: email"
            });
            return;
        }
        req.user.email = reqBody.email;

        if (reqBody.hasOwnProperty('password')) {
            if (reqBody.password.length < 6) {
                res.status(400).json({
                    status: "error",
                    message: "password must be more than 6 characters long"
                });
                return;
            }
        } else {
            res.status(400).json({
                status: "error",
                message: "Missing required field: password"
            });
            return;
        }
        
        req.user.password = reqBody.password;

        next();
    } catch (error) {
        next(error);
    }
}

export async function validateNameInBody(req: express.Request, res: express.Response, next: express.NextFunction ) {
        const reqBody = req.body;
        if (reqBody.hasOwnProperty('name')) {
            req.user.name = reqBody.name;
        } else {
            res.status(400).json({
                status: "error",
                message: "Missing required field: name"
                });
           return;
        }

        next();
}
