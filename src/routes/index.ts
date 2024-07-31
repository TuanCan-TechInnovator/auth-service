import { Router, Request, Response, NextFunction } from 'express';
import authRoutes from './authRoutes';

const router = Router();

// Example route
router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Auth Service API' });
});

// Health check route
router.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'UP' });
});

// Add more routes here
router.use('/auth', authRoutes);

export default router;
