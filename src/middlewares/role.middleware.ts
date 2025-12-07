import { Request, Response, NextFunction } from "express"

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(roles.length > 0 && !roles.includes(req.user?.role as string)) {
            return res.status(403).json({ 
                success: false,
                message: "Forbidden",
            })
        }
        next();
    }
} 