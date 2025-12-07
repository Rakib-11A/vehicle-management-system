import { config } from "../config/env";
import { ITokenPayload } from "../interfaces/auth.interface";
import jwt from 'jsonwebtoken';

export class JwtUtil {
    static generateToken(payload: ITokenPayload): string {
        const secret: jwt.Secret = config.jwt.secret;
        const options: jwt.SignOptions = {
            expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] || '7d'
        };
        return jwt.sign(payload as string | object | Buffer, secret, options);
    }

    static verifyToken(token: string): ITokenPayload {
        return jwt.verify(token, config.jwt.secret) as ITokenPayload;
    }
}