import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { addUser, User } from '../models/user';
import { FieldPacket } from 'mysql2';

export async function registerUser(userData: User): Promise<{ message: string, userId?: number }> {
    const { username, email, password, first_name, last_name, phone_number, address, city, state, postal_code, country, date_of_birth } = userData;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            email,
            password: hashedPassword,
            first_name,
            last_name,
            phone_number,
            address,
            city,
            state,
            postal_code,
            country,
            date_of_birth,
            is_active: false
        };
        const result = await addUser(newUser) as { insertId: number };
        return { message: 'User registered successfully', userId: result.insertId };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to register user: ${error.message}`);
        } else {
            throw new Error('Failed to register user: Unknown error');
        }
    }
}

export async function loginUser(email: string, password: string): Promise<{ message: string, token?: string }> {
    try {
        const connection = await pool.getConnection();
        const [rows]: [any[], FieldPacket[]] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        connection.release();

        if (rows.length === 0) {
            return { message: 'Email not found. Please register.' };
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { message: 'Invalid email or password' };
        }

        if (!user.is_active) {
            return { message: 'Account is not active. Please contact the administrator.' };
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        return { message: 'Login successful', token };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to login: ${error.message}`);
        } else {
            throw new Error('Failed to login: Unknown error');
        }
    }
}
