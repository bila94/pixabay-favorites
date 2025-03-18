import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { JwtPayload } from '../types/interfaces';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // No validation needed here - Joi already handled it!

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
    const { email, password } = req.body;

    // No validation needed here - Joi already handled it!

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