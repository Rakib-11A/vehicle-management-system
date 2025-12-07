"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.getVehicleById = exports.getAllVehicle = exports.createVehicle = void 0;
const vehicle_service_1 = require("../services/vehicle.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const vehicleService = new vehicle_service_1.VehicleService();
exports.createVehicle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await vehicleService.createVehicle(req.body);
    res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: result
    });
});
exports.getAllVehicle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await vehicleService.getAllVehicle();
    res.status(200).json({
        success: true,
        message: 'Vehicles retrieved successfully',
        data: result,
    });
});
exports.getVehicleById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await vehicleService.getVehicleById(Number(req.params.id));
    res.status(200).json({
        success: true,
        message: 'Vehicles retrieved successfully',
        data: result,
    });
});
exports.updateVehicle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await vehicleService.updateVehicle(Number(req.params.id), req.body);
    res.status(200).json({
        success: true,
        message: 'Vehicles updated successfully',
        data: result,
    });
});
exports.deleteVehicle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const vehicleId = Number(req.params.id);
    await vehicleService.deleteVehicle(vehicleId);
    res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully',
    });
});
//# sourceMappingURL=vehicle.controller.js.map