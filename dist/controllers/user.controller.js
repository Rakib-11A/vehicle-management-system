"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const userService = new user_service_1.UserService();
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await userService.getAllUsers();
    res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result
    });
});
exports.getUserById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = Number(req.params.userId);
    const result = await userService.getUserById(userId);
    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: result
    });
});
exports.updateUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = Number(req.params.userId);
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;
    if (!currentUserId || !currentUserRole) {
        const error = new Error('Authentication required');
        error.statusCode = 401;
        throw error;
    }
    const result = await userService.updateUser(userId, req.body, currentUserId, currentUserRole);
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result
    });
});
exports.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = Number(req.params.userId);
    await userService.deleteUser(userId);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});
//# sourceMappingURL=user.controller.js.map