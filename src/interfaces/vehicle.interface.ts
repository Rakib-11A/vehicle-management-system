export interface IVehicle {
    id?: number;
    vehicle_name: string;
    type: 'car' | 'bike' | 'van' | 'suv';
    registration_number: string;
    daily_rent_price: number;
    availability_status: 'available' | 'booked';
}

export interface IVehicleResponse {
    id:  number;
    vehicle_name: string;
    type: string;
    registration_number: string;
    daily_rent_price: number;
    availability_status: string;
}
