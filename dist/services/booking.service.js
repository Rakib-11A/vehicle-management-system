"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const database_1 = require("../config/database");
const constants_1 = require("../config/constants");
class BookingService {
    async createBooking(bookingData) {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = bookingData;
        if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
            const error = new Error('All fields are required: customer_id, vehicle_id, rent_start_date, rent_end_date');
            error.statusCode = 400;
            throw error;
        }
        const startDate = new Date(rent_start_date);
        const endDate = new Date(rent_end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDate < today) {
            const error = new Error('Rent start date cannot be in the past');
            error.statusCode = 400;
            throw error;
        }
        if (startDate >= endDate) {
            const error = new Error('Rent end date must be after rent start date');
            error.statusCode = 400;
            throw error;
        }
        // Check if customer exists
        const customerResult = await database_1.pool.query(`SELECT id FROM users WHERE id = $1`, [customer_id]);
        if (customerResult.rows.length === 0) {
            const error = new Error('Customer not found');
            error.statusCode = 404;
            throw error;
        }
        // Check if vehicle exists and is available
        const vehicleResult = await database_1.pool.query(`SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1`, [vehicle_id]);
        if (vehicleResult.rows.length === 0) {
            const error = new Error('Vehicle not found');
            error.statusCode = 404;
            throw error;
        }
        const vehicle = vehicleResult.rows[0];
        if (vehicle.availability_status !== constants_1.AVAILABLE_STATUS.AVAILABLE) {
            const error = new Error('Vehicle is not available for booking');
            error.statusCode = 400;
            throw error;
        }
        // Calculate number of days
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const totalPrice = parseFloat(vehicle.daily_rent_price) * daysDiff;
        const client = await database_1.pool.connect();
        try {
            await client.query('BEGIN');
            // Update vehicle availability status
            await client.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2`, [constants_1.AVAILABLE_STATUS.BOOKED, vehicle_id]);
            // Create booking
            const bookingResult = await client.query(`INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
                 VALUES($1, $2, $3, $4, $5, $6) 
                 RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, constants_1.BOOKING_STATUS.ACTIVE]);
            await client.query('COMMIT');
            const booking = bookingResult.rows[0];
            return {
                id: booking.id,
                customer_id: booking.customer_id,
                vehicle_id: booking.vehicle_id,
                rent_start_date: booking.rent_start_date,
                rent_end_date: booking.rent_end_date,
                total_price: parseFloat(booking.total_price),
                status: booking.status,
                vehicle: {
                    vehicle_name: vehicle.vehicle_name,
                    daily_rent_price: parseFloat(vehicle.daily_rent_price)
                }
            };
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async getAllBooking(currentUserId, currentUserRole) {
        let bookingResult;
        if (currentUserRole === constants_1.USER_ROLES.ADMIN) {
            bookingResult = await database_1.pool.query(`
                SELECT
                    b.id,
                    b.customer_id,
                    b.vehicle_id,
                    b.rent_start_date,
                    b.rent_end_date,
                    b.total_price,
                    b.status,
                    u.name as customer_name,
                    u.email as customer_email,
                    v.vehicle_name,
                    v.registration_number
                FROM bookings b
                INNER JOIN users u ON b.customer_id = u.id
                INNER JOIN vehicles v ON b.vehicle_id = v.id
                ORDER BY b.id DESC
            `);
        }
        else {
            bookingResult = await database_1.pool.query(`
                SELECT 
                    b.id,
                    b.vehicle_id,
                    b.rent_start_date,
                    b.rent_end_date,
                    b.total_price,
                    b.status,
                    v.vehicle_name,
                    v.registration_number,
                    v.type
                FROM bookings b
                INNER JOIN vehicles v ON b.vehicle_id = v.id
                WHERE b.customer_id = $1
                ORDER BY b.id DESC
            `, [currentUserId]);
        }
        if (bookingResult.rows.length === 0) {
            return [];
        }
        return bookingResult.rows.map((row) => {
            if (currentUserRole === constants_1.USER_ROLES.ADMIN) {
                return {
                    id: row.id,
                    customer_id: row.customer_id,
                    vehicle_id: row.vehicle_id,
                    rent_start_date: row.rent_start_date,
                    rent_end_date: row.rent_end_date,
                    total_price: parseFloat(row.total_price),
                    status: row.status,
                    customer: {
                        name: row.customer_name,
                        email: row.customer_email
                    },
                    vehicle: {
                        vehicle_name: row.vehicle_name,
                        registration_number: row.registration_number
                    }
                };
            }
            else {
                return {
                    id: row.id,
                    vehicle_id: row.vehicle_id,
                    rent_start_date: row.rent_start_date,
                    rent_end_date: row.rent_end_date,
                    total_price: parseFloat(row.total_price),
                    status: row.status,
                    vehicle: {
                        vehicle_name: row.vehicle_name,
                        registration_number: row.registration_number,
                        type: row.type
                    }
                };
            }
        });
    }
    async updateBooking(bookingId, status, currentUserId, currentUserRole) {
        const bookingResult = await database_1.pool.query(`
            SELECT b.*, v.availability_status
            FROM bookings b
            LEFT JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.id = $1
        `, [bookingId]);
        if (bookingResult.rows[0].length === 0) {
            const error = new Error('Booking not found');
            error.statusCode = 404;
            throw error;
        }
        const booking = bookingResult.rows[0];
        if (currentUserRole !== constants_1.USER_ROLES.ADMIN && booking.customer_id !== currentUserId) {
            const error = new Error('Forbidden: You can only updte your own bookings');
            error.statusCode = 404;
            throw error;
        }
        const validStatus = [constants_1.BOOKING_STATUS.CANCELLED, constants_1.BOOKING_STATUS.RETURNED];
        if (!validStatus.includes(status)) {
            const error = new Error(`Invalide status: Must be on of: ${validStatus.join(', ')}`);
            error.statusCode = 404;
            throw error;
        }
        if (currentUserRole === constants_1.USER_ROLES.CUSTOMER && status === constants_1.BOOKING_STATUS.CANCELLED) {
            const startDate = new Date(booking.rent_start_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (startDate <= today) {
                const error = new Error('Cannot cancel booking: Start date has already passed');
                error.statusCode = 400;
                throw error;
            }
        }
        if (booking.status === constants_1.BOOKING_STATUS.CANCELLED || booking.status === constants_1.BOOKING_STATUS.RETURNED) {
            const error = new Error(`Booking is already ${booking.status}`);
            error.statusCode = 400;
            throw error;
        }
        const client = await database_1.pool.connect();
        try {
            await client.query('BEGIN');
            // booking er status update koralm
            await client.query(`
                UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *
            `, [status, bookingId]);
            // jodi status returned hoi tahole, update status = "available"
            if (status === constants_1.BOOKING_STATUS.RETURNED) {
                await client.query(`
                    UPDATE vehicle SET available_status = $1 WHERE id = $2
                    `, [constants_1.AVAILABLE_STATUS.AVAILABLE, booking.vehicle_id]);
            }
            // jodi status 'cancelled' hoi, update vehicle status = 'availbale'
            if (status === constants_1.BOOKING_STATUS.CANCELLED) {
                await client.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2`, [constants_1.AVAILABLE_STATUS.AVAILABLE, booking.vehicle_id]);
            }
            await client.query('COMMIT');
            const updatedBookingResult = await database_1.pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
            const updatedBooking = updatedBookingResult.rows[0];
            let vehicleInfo = null;
            if (status === constants_1.BOOKING_STATUS.RETURNED) {
                const vehicleResult = await database_1.pool.query(`SELECT available_status FROM vehicles WHERE id = $1`, [booking.vehicle_id]);
                vehicleInfo = vehicleResult.rows[0];
            }
            const response = {
                id: updatedBooking.id,
                customer_id: updatedBooking.customer_id,
                vehicle_id: updatedBooking.vehicle_id,
                rent_start_date: updatedBooking.rent_start_date,
                rent_end_date: updatedBooking.rent_end_date,
                total_price: parseFloat(updatedBooking.total_price),
                status: updatedBooking.status,
                vehicle: vehicleInfo ? {
                    availability_status: vehicleInfo.availability_status
                } : {
                    vehicle_name: ''
                }
            };
            return response;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
}
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map