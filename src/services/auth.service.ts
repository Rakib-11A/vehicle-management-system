import { pool } from "../config/database";
import { ISigninCredentials, ISignupData, ISinginResponse, ISingupResponse } from "../interfaces/auth.interface";
import { JwtUtil } from "../utils/jwt.util";
import { PasswordUtil } from "../utils/password.util";

export class AuthService {
    async signup(data: ISignupData): Promise<ISingupResponse> {
        const { name, email, password, phone, role } = data;
        
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if(existingUser.rows.length > 0){
            throw new Error('User already exists with this email');
        }

        const hashedPassword = await PasswordUtil.hash(password);

        const query = `INSERT INTO users (name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`;
        const values = [ name, email, hashedPassword, phone, role || 'customer'];
        const result = await pool.query(query, values);
        const user = result.rows[0];

        const token = JwtUtil.generateToken({
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
        return retrunData ;
    }

    async signin(credentials: ISigninCredentials): Promise<ISinginResponse> {
        const { email, password } = credentials;

        // Validate input
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if(result.rows.length === 0) {
            throw new Error('Invalid email or password');
        }

        const user = result.rows[0];

        // Check if user has a password (shouldn't happen, but safety check)
        if (!user.password) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await PasswordUtil.compare(password, user.password);

        if(!isPasswordValid){
            throw new Error('Invalid email or password');
        }

        const token = JwtUtil.generateToken({
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
        }
    }
}