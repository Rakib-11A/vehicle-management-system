import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";

const userService = new UserService();

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getAllUsers();
    res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result
    })
})

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const result = await userService.getUserById(userId);
    
    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: result
    })
})

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;
    
    if (!currentUserId || !currentUserRole) {
        const error = new Error('Authentication required');
        (error as any).statusCode = 401;
        throw error;
    }

    const result = await userService.updateUser(
        userId, 
        req.body, 
        currentUserId, 
        currentUserRole
    );
    
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result
    })
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    await userService.deleteUser(userId);
    
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    })
});