import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Generate token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  new ApiResponse(res, 200, { token, user: { id: user.id, username: user.username, role: user.role } }, 'Login successful');
};

export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new ApiError(401, 'Unauthorized: User not found in request');
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      role: true
    }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  new ApiResponse(res, 200, user, 'User fetched successfully');
};