export interface IBooking {
    id?: number;
    customer_id: number;
    vehicle_id: number;
    rent_start_date: Date | string;
    rent_end_date: Date | string;
}

export interface IBookingResponse {
    id: number;
    customer_id?: number;
    vehicle_id: number;
    rent_start_date: Date | string;
    rent_end_date: Date | string;
    total_price: number;
    status: string;
    customer?: {
        name: string;
        email: string;
    };
    vehicle: {
        vehicle_name?: string;
        daily_rent_price?: number;
        registration_number?: string;
        type?: string;
        availability_status?: string;
    }
}