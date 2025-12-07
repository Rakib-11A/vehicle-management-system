import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { asyncHandler } from "../utils/asyncHandler";

const bookingService = new BookingService();

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
    const result = await bookingService.createBooking(req.body);
    res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
});

export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;
    
    if (!currentUserId || !currentUserRole) {
        const error = new Error('Authentication required');
        (error as any).statusCode = 401;
        throw error;
    }

    const result = await bookingService.getAllBooking(currentUserId, currentUserRole);
    
    const message = currentUserRole === 'admin' 
        ? 'Bookings retrieved successfully' 
        : 'Your bookings retrieved successfully';
    
    res.status(200).json({
        success: true,
        message: message,
        data: result,
    });
});

export const updateBooking = asyncHandler(async (req: Request, res: Response) => {
    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;
    
    if (!currentUserId || !currentUserRole) {
        const error = new Error('Authentication required');
        (error as any).statusCode = 401;
        throw error;
    }

    if (!status) {
        const error = new Error('Status is required');
        (error as any).statusCode = 400;
        throw error;
    }

    const result = await bookingService.updateBooking(
        bookingId,
        status,
        currentUserId,
        currentUserRole
    );

    let message = 'Booking updated successfully';
    if (status === 'cancelled') {
        message = 'Booking cancelled successfully';
    } else if (status === 'returned') {
        message = 'Booking marked as returned. Vehicle is now available';
    }

    res.status(200).json({
        success: true,
        message: message,
        data: result,
    });
});
