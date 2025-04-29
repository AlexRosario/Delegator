import { Router } from 'express';
import 'express-async-errors';
import { loginSchema, registerSchema } from '../zod.js';
import { encryptPassword } from '../utils/auth-utils.js';
import { validateRequest } from 'zod-express-middleware';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  createUnsecuredInfo
} from '../utils/auth-utils.js';
const prisma = new PrismaClient();

const authController = Router();

authController.post(
  '/auth/register',
  validateRequest(registerSchema),
  async (req, res) => {
    const { email, username, password, address } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: await encryptPassword(password),
        street: address.street,
        city: address.city,
        state: address.state,
        zipcode: address.zipcode
      }
    });
    if (!newUser) {
      return res.status(500).json({ message: 'User creation failed' });
    }
    console.log('User created:', newUser);
    return res.status(201).json({ message: 'User created successfully' });
  }
);

authController.get('/logout', async (_req, res) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  res.status(200).json({ message: 'Logout successful' });
});

authController.post(
  '/auth/login',
  validateRequest(loginSchema),
  async (req, res) => {
    console.log('Login request received');
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { username }
    });
    console.log('User found:', user);
    if (!user) {
      return res.status(404).json({ message: 'User not found ' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userInfo = createUnsecuredInfo(user);
    const token = generateAccessToken(user);
    console.log('Access token generated:', token);
    console.log('User info:', userInfo);
    return res.status(200).json({
      token,
      userInfo
    });
  }
);

export { authController };
