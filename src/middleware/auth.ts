import type { Request, Response, NextFunction } from "express"
import User, { IUser } from "../models/User";
import { decodeJWT, verifyJWT } from "../utils/jwt";
import { sendAuthError } from "../utils/auth";

declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;

    if(!bearerToken) return sendAuthError(res, "No autorizado")
    
    const token = bearerToken.split(" ")[1];
    
    if(!token) return sendAuthError(res, "No autorizado")

    try {
        verifyJWT(token);

        const decoded = decodeJWT(token);

        const currentTime = new Date().valueOf();
        
        if(typeof decoded !== 'object' || !decoded.id) return sendAuthError(res, "Token no válido");
        
        if(decoded.exp && currentTime > (decoded.exp * 1000)) return sendAuthError(res, "La sesión ha expirado");
    
        const user = await User.findById(decoded.id).select('-password');

        if(!user) return sendAuthError(res, "Token no válido")

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({  error: 'Token no válido'});
    }
}