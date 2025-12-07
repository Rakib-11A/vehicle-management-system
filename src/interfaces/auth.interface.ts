export interface ISigninCredentials {
    email: string;
    password: string;
}

export interface ISignupData {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'customer' | 'admin'
}

export interface ITokenPayload {
    userId: number;
    name: string;
    email: string;
    phone: string;
    role: string;
}

export interface ISingupResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
}

export interface ISinginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        role: string;
    };
}