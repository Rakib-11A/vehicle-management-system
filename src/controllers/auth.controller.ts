import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const singup = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.signup(req.body);
    res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
});

export const signin = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.signin(req.body);
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
    })
})