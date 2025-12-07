import { IVehicle, IVehicleResponse } from "../interfaces/vehicle.interface";
export declare class VehicleService {
    createVehicle(data: IVehicle): Promise<IVehicleResponse>;
    getAllVehicle(): Promise<IVehicleResponse[]>;
    getVehicleById(vehicleId: number): Promise<IVehicleResponse>;
    updateVehicle(vehicleId: number, vehicleData: Partial<IVehicle>): Promise<IVehicleResponse>;
    deleteVehicle(vehicleId: number): Promise<void>;
}
//# sourceMappingURL=vehicle.service.d.ts.map