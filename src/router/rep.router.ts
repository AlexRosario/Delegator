import { Router } from 'express';
import 'express-async-errors';
import { loginSchema, registerSchema } from '../zod.js';
import { encryptPassword } from '../utils/auth-utils.js';
import { validateRequest } from 'zod-express-middleware';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const repController = Router();
