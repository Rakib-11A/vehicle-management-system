"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.singup = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
exports.singup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService.signup(req.body);
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
    });
});
exports.signin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService.signin(req.body);
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
    });
});
//# sourceMappingURL=auth.controller.js.map