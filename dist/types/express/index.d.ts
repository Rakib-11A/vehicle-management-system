import type { ITokenPayload } from "../../interfaces/auth.interface";
declare global {
    namespace Express {
        interface Request {
            user?: ITokenPayload;
        }
    }
}
export {};
//# sourceMappingURL=index.d.ts.map