import { pool } from "../config/database";
import { IVehicle, IVehicleResponse } from "../interfaces/vehicle.interface";
import { BOOKING_STATUS } from "../config/constants";

export class VehicleService {
    async createVehicle(data: IVehicle): Promise<IVehicleResponse> {
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = data;

        const exists = await pool.query(`SELECT * FROM vehicles WHERE registration_number = $1`, [registration_number]);
        if(exists.rows.length > 0){
            throw new Error('Vehicle with this registration number already exists');
        }
        const query = `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`;
        const values = [vehicle_name, type, registration_number, daily_rent_price, availability_status];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getAllVehicle(): Promise<IVehicleResponse[]> {
        const result = await pool.query(`SELECT * FROM vehicles`);
        return result.rows;
    }

    async getVehicleById(vehicleId: number): Promise<IVehicleResponse> {
        const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
        
        if (!result.rows[0]) {
            const error = new Error('Vehicle not found');
            (error as any).statusCode = 404;
            throw error;
        }
        
        return result.rows[0];
    }
    async updateVehicle(vehicleId: number, vehicleData: Partial<IVehicle>): Promise<IVehicleResponse> {
        const isExists = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
        if(!isExists.rows[0]){
            const error = new Error('Vehicle not found');
            (error as any).statusCode = 404;
            throw error;
        }

        const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = vehicleData;
        
        // Validate type if provided
        if (type !== undefined) {
            const validTypes = ['car', 'bike', 'van', 'suv'];
            if (!validTypes.includes(type)) {
                const error = new Error(`Invalid vehicle type. Must be one of: ${validTypes.join(', ')}`);
                (error as any).statusCode = 400;
                throw error;
            }
        }

        
        const updates: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if(vehicle_name !== undefined){
            updates.push(`vehicle_name = $${idx}`);
            values.push(vehicle_name);
            idx++;
        }
        if(type !== undefined){
            updates.push(`type = $${idx}`);
            values.push(type);
            idx++;
        }
        if(registration_number !== undefined){
            updates.push(`registration_number = $${idx}`);
            values.push(registration_number);
            idx++;
        }
        if(daily_rent_price !== undefined){
            updates.push(`daily_rent_price = $${idx}`);
            values.push(daily_rent_price);
            idx++;
        }
        if(availability_status !== undefined){
            updates.push(`availability_status = $${idx}`);
            values.push(availability_status);
            idx++;
        }

        if (updates.length === 0) {
            return isExists.rows[0];
        }

        values.push(vehicleId);

        const query = `
            UPDATE vehicles
            SET ${updates.join(', ')}
            WHERE id = $${idx}
            RETURNING *
        `;
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async deleteVehicle(vehicleId: number): Promise<void> {

        const vehicleExists = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
        if(!vehicleExists.rows[0]){
            const error = new Error('Vehicle not found');
            (error as any).statusCode = 404;
            throw error;
        }


        const activeBookings = await pool.query(
            `SELECT id FROM bookings WHERE vehicle_id = $1 AND status = $2`,
            [vehicleId, BOOKING_STATUS.ACTIVE]
        );

        if(activeBookings.rows.length > 0){
            const error = new Error('Cannot delete vehicle: Vehicle has active bookings');
            (error as any).statusCode = 400;
            throw error;
        }

        const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [vehicleId]);
        
        if(result.rowCount === 0){
            const error = new Error('Failed to delete vehicle');
            (error as any).statusCode = 500;
            throw error;
        }
    }
}