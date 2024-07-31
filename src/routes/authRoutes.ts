import { Router } from 'express';
import { validateRegisterForm, checkUserExists, validateLoginForm } from '../middlewares/authMiddleware';
import { register, login } from '../controllers/authController';

const router = Router();

// Register route
router.post('/register', validateRegisterForm, checkUserExists, register);

// Login route
router.post('/login', validateLoginForm, login);

export default router;