import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { RegisterPayload, LoginPayload, JwtPayload } from '../types/interfaces';

// Validation helpers
const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

const validatePassword = (password: string): boolean => {
  // At least 8 characters, one lowercase, one uppercase, one number, and one special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return re.test(password);
};

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: RegisterPayload = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }

    if (!validatePassword(password)) {
      res.status(400).json({ 
        message: 'Password must be at least 8 characters and include lowercase, uppercase, number, and special character' 
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    const user = await User.create({ email, password });

    // Generate token
    const token = jwt.sign(
      { userId: user.id } as JwtPayload, 
      process.env.JWT_SECRET || '', 
      { expiresIn: '1d' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Add better error handling for Sequelize validation errors
    if ((error as any).name === 'SequelizeValidationError') {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginPayload = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id } as JwtPayload, 
      process.env.JWT_SECRET || '', 
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};