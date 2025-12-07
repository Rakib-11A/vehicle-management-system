import { Request, Response } from "express";
import { VehicleService } from "../services/vehicle.service";
import { asyncHandler } from "../utils/asyncHandler";

const vehicleService = new VehicleService();

export const createVehicle = asyncHandler(async (req: Request, res: Response ) => {
    const result = await vehicleService.createVehicle(req.body);

    res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: result
    });
});

export const getAllVehicle = asyncHandler(async (req: Request, res: Response) => {
    const result = await vehicleService.getAllVehicle();

    res.status(200).json({
        success: true,
        message: 'Vehicles retrieved successfully',
        data: result,
    })
});

export const getVehicleById = asyncHandler(async (req: Request, res: Response) => {
    const result = await vehicleService.getVehicleById(Number(req.params.id));

    res.status(200).json({
        success: true,
        message: 'Vehicles retrieved successfully',
        data: result,
    })
});

export const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
    const result = await vehicleService.updateVehicle(Number(req.params.id), req.body);
    
    res.status(200).json({
        success: true,
        message: 'Vehicles updated successfully',
        data: result,
    })
});

export const deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
    const vehicleId = Number(req.params.id);
    await vehicleService.deleteVehicle(vehicleId);
    
    res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully',
    })
});