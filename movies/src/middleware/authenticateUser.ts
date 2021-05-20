import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;

const authenticateUser = (req:Request, res:Response, next: NextFunction):any => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        res.locals.userName = user;
        next();
    } catch(error) {
        return res.status(403).json({ error: "Provided token in invalid: " + error.message });
    }
}

export default authenticateUser;