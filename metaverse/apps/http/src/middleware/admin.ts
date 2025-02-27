declare global {
    namespace Express {
        export interface Request {
            role?: "Admin" | "User";
            userId?: string;
        }
    }
}

import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { NextFunction, Request, Response } from "express";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['authorization'];
    const token = header?.split(' ')[1];
    if (!token) {
        res.status(403).json({
            message: 'Unauthorized'
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as { role: "Admin" | "User", userId: string };
        req.userId = decoded.userId;
        if (decoded.role != "Admin") {
            res.status(403).json({
                message: 'Unauthorized'
            });
            return;
        }

        next();



    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }


}