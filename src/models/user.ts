import { Pool, QueryResult } from 'mysql2/promise';
import pool from '../config/database';

export interface User {
    id?: number;
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    date_of_birth?: Date;
    created_at?: Date;
    updated_at?: Date;
    last_login?: Date;
    is_active?: boolean;
}

export async function addUser(user: User): Promise<QueryResult> {
    const addUserQuery = `
        INSERT INTO users (
            username, email, password, first_name, last_name, phone_number, address, city, state, postal_code, country, date_of_birth, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        user.username, user.email, user.password, user.first_name, user.last_name, user.phone_number, user.address, user.city, user.state, user.postal_code, user.country, user.date_of_birth, user.is_active
    ];

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query(addUserQuery, values);
        connection.release();
        return result;
    } catch (error) {
        console.error('Failed to add user:', error);
        throw error;
    }
}
