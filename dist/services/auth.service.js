"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../config/database");
const jwt_util_1 = require("../utils/jwt.util");
const password_util_1 = require("../utils/password.util");
class AuthService {
    async signup(data) {
        const { name, email, password, phone, role } = data;
        const existingUser = await database_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            throw new Error('User already exists with this email');
        }
        const hashedPassword = await password_util_1.PasswordUtil.hash(password);
        const query = `INSERT INTO users (name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`;
        const values = [name, email, hashedPassword, phone, role || 'customer'];
        const result = await database_1.pool.query(query, values);
        const user = result.rows[0];
        const token = jwt_util_1.JwtUtil.generateToken({
            userId: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        });
        console.log(token);
        const retrunData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };
        return retrunData;
    }
    async signin(credentials) {
        const { email, password } = credentials;
        // Validate input
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        const result = await database_1.pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (result.rows.length === 0) {
            throw new Error('Invalid email or password');
        }
        const user = result.rows[0];
        // Check if user has a password (shouldn't happen, but safety check)
        if (!user.password) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await password_util_1.PasswordUtil.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const token = jwt_util_1.JwtUtil.generateToken({
            userId: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map