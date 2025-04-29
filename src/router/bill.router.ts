import { Router } from 'express';
import 'express-async-errors';
import { encryptPassword } from '../utils/auth-utils.js';
import { validateRequest } from 'zod-express-middleware';
import { PrismaClient } from '@prisma/client';
i;

const prisma = new PrismaClient();

const billController = Router();

billController.post(
  '/bills',
  validateRequest(registerSchema),
  async (req, res) => {
    const bills = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const existingUsername = await prisma.user.findUnique({
      where: {}
    });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = await prisma.bill.create({
      data: {
        ...bills
      }
    });
    if (!newUser) {
      return res.status(500).json({ message: 'User creation failed' });
    }
    console.log('User created:', newUser);
    return res.status(201).json({ message: 'User created successfully' });
  }
);
