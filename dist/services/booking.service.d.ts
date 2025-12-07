import { IBooking, IBookingResponse } from "../interfaces/booking.interface";
export declare class BookingService {
    createBooking(bookingData: IBooking): Promise<IBookingResponse>;
    getAllBooking(currentUserId: number, currentUserRole: string): Promise<IBookingResponse[]>;
    updateBooking(bookingId: number, status: string, currentUserId: number, currentUserRole: string): Promise<IBookingResponse>;
}
//# sourceMappingURL=booking.service.d.ts.map