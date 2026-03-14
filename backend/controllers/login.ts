import type { Request, Response } from 'express';

// Valid credentials
const VALID_USERS = ['Trainer Lisa', 'Coach Mike', 'Trainer Sarah'];
const VALID_PASSWORD = 'password123';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
      return;
    }
    
    const isValidUser = VALID_USERS.includes(username);
    const isValidPassword = password === VALID_PASSWORD;
    
    if (isValidUser && isValidPassword) {
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          username: username
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};