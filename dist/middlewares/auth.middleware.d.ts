import { NextFunction, Request, Response } from "express";
declare const auth: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default auth;
//# sourceMappingURL=auth.middleware.d.ts.map