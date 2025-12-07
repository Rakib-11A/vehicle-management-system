"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBooking = exports.getAllBookings = exports.createBooking = void 0;
const booking_service_1 = require("../services/booking.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const bookingService = new booking_service_1.BookingService();
exports.createBooking = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await bookingService.createBooking(req.body);
    res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
});
exports.getAllBookings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;
    if (!currentUserId || !currentUserRole) {
        const error = new Error('Authentication required');
        error.statusCode = 401;
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
exports.updateBooking = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;
    if (!currentUserId || !currentUserRole) {
        const error = new Error('Authentication required');
        error.statusCode = 401;
        throw error;
    }
    if (!status) {
        const error = new Error('Status is required');
        error.statusCode = 400;
        throw error;
    }
    const result = await bookingService.updateBooking(bookingId, status, currentUserId, currentUserRole);
    let message = 'Booking updated successfully';
    if (status === 'cancelled') {
        message = 'Booking cancelled successfully';
    }
    else if (status === 'returned') {
        message = 'Booking marked as returned. Vehicle is now available';
    }
    res.status(200).json({
        success: true,
        message: message,
        data: result,
    });
});
//# sourceMappingURL=booking.controller.js.map