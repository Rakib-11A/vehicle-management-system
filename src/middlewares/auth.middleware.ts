import { NextFunction, Request, Response } from "express"
import { JwtUtil } from "../utils/jwt.util";
import { ITokenPayload } from "../interfaces/auth.interface";
import { authorize } from "./role.middleware";

const auth = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            const token = req.headers.authorization?.split(' ')[1];
            if(!token){
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
            }

            const decoded = JwtUtil.verifyToken(token) as ITokenPayload;
            req.user = decoded;

            if (roles.length > 0) {
                const authorization = authorize(roles);
                return authorization(req, res, next);
            }
            
            next();
        }catch(error){
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            })
        }
    }
}
export default auth;