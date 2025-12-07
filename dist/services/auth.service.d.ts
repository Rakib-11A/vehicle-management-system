import { ISigninCredentials, ISignupData, ISinginResponse, ISingupResponse } from "../interfaces/auth.interface";
export declare class AuthService {
    signup(data: ISignupData): Promise<ISingupResponse>;
    signin(credentials: ISigninCredentials): Promise<ISinginResponse>;
}
//# sourceMappingURL=auth.service.d.ts.map