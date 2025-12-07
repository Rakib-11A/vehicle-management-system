import { IUser, IUserResponse } from "../interfaces/user.interface";
import { pool } from "../config/database";
import { USER_ROLES, BOOKING_STATUS } from "../config/constants";
export class UserService {
    
    async getAllUsers(): Promise<IUserResponse[]> {
        const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
        if(result.rowCount === 0){
            const error = new Error('User not found');
            (error as any).statusCode = 404;
            throw error;
        }
        return result.rows;
    }

    async getUserById(userId: number): Promise<IUserResponse> {
        const result = await pool.query(`SELECT id, name, email, phone, role FROM users WHERE id = $1`, [userId]);
        if(result.rowCount === 0){
            const error = new Error('User not found');
            (error as any).statusCode = 404;
            throw error;
        }
        return result.rows[0];
    }

    async updateUser(
        userId: number, 
        userData: Partial<IUserResponse>, 
        currentUserId: number, 
        currentUserRole: string
    ): Promise<IUserResponse> {
        
        const isUserExists = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
        if(!isUserExists.rows[0]){
            const error = new Error('User not found');
            (error as any).statusCode = 404;
            throw error;
        }

    
        if(currentUserRole !== USER_ROLES.ADMIN && currentUserId !== userId){
            const error = new Error('Forbidden: You can only update your own profile');
            (error as any).statusCode = 403;
            throw error;
        }

        if(currentUserRole !== USER_ROLES.ADMIN && userData.role !== undefined){
            const error = new Error('Forbidden: You cannot change your role');
            (error as any).statusCode = 403;
            throw error;
        }

        const { name, email, phone, role } = userData;
        const updates: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if(name !== undefined){
            updates.push(`name = $${idx}`);
            values.push(name);
            idx++;
        }
        if(email !== undefined){
            updates.push(`email = $${idx}`);
            values.push(email);
            idx++;
        }
        if(phone !== undefined){
            updates.push(`phone = $${idx}`);
            values.push(phone);
            idx++;
        }
        if(role !== undefined && currentUserRole === USER_ROLES.ADMIN){
            updates.push(`role = $${idx}`);
            values.push(role);
            idx++;
        }

        if(updates.length === 0){
            const { password, ...userWithoutPassword } = isUserExists.rows[0];
            return userWithoutPassword as IUserResponse;
        }
        
        values.push(userId);
        const query = `
            UPDATE users
            SET ${updates.join(', ')}
            WHERE id = $${idx}
            RETURNING id, name, email, phone, role
        `;

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async deleteUser(userId: number): Promise<void> {
        // Check if user exists
        const isUserExists = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
        if(!isUserExists.rows[0]){
            const error = new Error('User not found');
            (error as any).statusCode = 404;
            throw error;
        }

        const activeBookings = await pool.query(
            `SELECT id FROM bookings WHERE customer_id = $1 AND status = $2`,
            [userId, BOOKING_STATUS.ACTIVE]
        );

        if(activeBookings.rows.length > 0){
            const error = new Error('Cannot delete user: User has active bookings');
            (error as any).statusCode = 400;
            throw error;
        }

        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
        
        if(result.rowCount === 0){
            const error = new Error('Failed to delete user');
            (error as any).statusCode = 500;
            throw error;
        }
    }
}