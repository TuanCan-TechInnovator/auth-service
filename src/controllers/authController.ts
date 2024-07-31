import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

export async function register(req: Request, res: Response) {
    const { username, email, password, first_name, last_name, phone_number, address, city, state, postal_code, country, date_of_birth } = req.body;

    try {
        const result = await registerUser({
            username,
            email,
            password,
            first_name,
            last_name,
            phone_number,
            address,
            city,
            state,
            postal_code,
            country,
            date_of_birth
        });
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to register user', error: error.message });
        } else {
            res.status(500).json({ message: 'Failed to register user', error: 'Unknown error' });
        }
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const result = await loginUser(email, password);
        if (result.token) {
            res.json(result);
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to login', error: error.message });
        } else {
            res.status(500).json({ message: 'Failed to login', error: 'Unknown error' });
        }
    }
}