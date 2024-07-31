import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { check, validationResult } from 'express-validator';
import { FieldPacket } from 'mysql2';

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
}

export function validateLoginForm(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    next();
}

export async function checkUserExists(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    try {
        const connection = await pool.getConnection();
        const [rows]: [any[], FieldPacket[]] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        connection.release();

        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export const validateRegisterForm = [
    check('username').notEmpty().withMessage('Field username is required.'),
    check('email').isEmail().withMessage('Invalid email format.'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    check('first_name').notEmpty().withMessage('Field first_name is required.'),
    check('last_name').notEmpty().withMessage('Field last_name is required.'),
    check('phone_number').notEmpty().withMessage('Field phone_number is required.'),
    check('address').notEmpty().withMessage('Field address is required.'),
    check('city').notEmpty().withMessage('Field city is required.'),
    check('state').notEmpty().withMessage('Field state is required.'),
    check('postal_code').notEmpty().withMessage('Field postal_code is required.'),
    check('country').notEmpty().withMessage('Field country is required.'),
    check('date_of_birth').notEmpty().withMessage('Field date_of_birth is required.'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];