"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../config/database");
const constants_1 = require("../config/constants");
class UserService {
    async getAllUsers() {
        const result = await database_1.pool.query(`SELECT id, name, email, phone, role FROM users`);
        if (result.rowCount === 0) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return result.rows;
    }
    async getUserById(userId) {
        const result = await database_1.pool.query(`SELECT id, name, email, phone, role FROM users WHERE id = $1`, [userId]);
        if (result.rowCount === 0) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return result.rows[0];
    }
    async updateUser(userId, userData, currentUserId, currentUserRole) {
        const isUserExists = await database_1.pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
        if (!isUserExists.rows[0]) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        if (currentUserRole !== constants_1.USER_ROLES.ADMIN && currentUserId !== userId) {
            const error = new Error('Forbidden: You can only update your own profile');
            error.statusCode = 403;
            throw error;
        }
        if (currentUserRole !== constants_1.USER_ROLES.ADMIN && userData.role !== undefined) {
            const error = new Error('Forbidden: You cannot change your role');
            error.statusCode = 403;
            throw error;
        }
        const { name, email, phone, role } = userData;
        const updates = [];
        const values = [];
        let idx = 1;
        if (name !== undefined) {
            updates.push(`name = $${idx}`);
            values.push(name);
            idx++;
        }
        if (email !== undefined) {
            updates.push(`email = $${idx}`);
            values.push(email);
            idx++;
        }
        if (phone !== undefined) {
            updates.push(`phone = $${idx}`);
            values.push(phone);
            idx++;
        }
        if (role !== undefined && currentUserRole === constants_1.USER_ROLES.ADMIN) {
            updates.push(`role = $${idx}`);
            values.push(role);
            idx++;
        }
        if (updates.length === 0) {
            const { password, ...userWithoutPassword } = isUserExists.rows[0];
            return userWithoutPassword;
        }
        values.push(userId);
        const query = `
            UPDATE users
            SET ${updates.join(', ')}
            WHERE id = $${idx}
            RETURNING id, name, email, phone, role
        `;
        const result = await database_1.pool.query(query, values);
        return result.rows[0];
    }
    async deleteUser(userId) {
        // Check if user exists
        const isUserExists = await database_1.pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
        if (!isUserExists.rows[0]) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        const activeBookings = await database_1.pool.query(`SELECT id FROM bookings WHERE customer_id = $1 AND status = $2`, [userId, constants_1.BOOKING_STATUS.ACTIVE]);
        if (activeBookings.rows.length > 0) {
            const error = new Error('Cannot delete user: User has active bookings');
            error.statusCode = 400;
            throw error;
        }
        const result = await database_1.pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
        if (result.rowCount === 0) {
            const error = new Error('Failed to delete user');
            error.statusCode = 500;
            throw error;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map