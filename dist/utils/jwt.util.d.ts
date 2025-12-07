import { ITokenPayload } from "../interfaces/auth.interface";
export declare class JwtUtil {
    static generateToken(payload: ITokenPayload): string;
    static verifyToken(token: string): ITokenPayload;
}
//# sourceMappingURL=jwt.util.d.ts.map