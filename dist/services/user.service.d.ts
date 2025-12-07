import { IUserResponse } from "../interfaces/user.interface";
export declare class UserService {
    getAllUsers(): Promise<IUserResponse[]>;
    getUserById(userId: number): Promise<IUserResponse>;
    updateUser(userId: number, userData: Partial<IUserResponse>, currentUserId: number, currentUserRole: string): Promise<IUserResponse>;
    deleteUser(userId: number): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map