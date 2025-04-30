import { NextFunction, Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import { getDataFromToken } from '../utils/auth-utils.js';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();
const voteController = Router();

const voteSchema = z.object({
  billId: z.string(),
  vote: z.enum(['Yes', 'No']),
  date: z.preprocess((val) => new Date(val as string), z.instanceof(Date))
});
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; username: string; zipcode: string };
    }
  }
}
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  const data = getDataFromToken(token) as JwtPayload;

  console.log('Token data:', data);
  if (!data) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
  const userFromJwt = await prisma.user.findUnique({
    where: { username: data?.username }
  });

  if (!userFromJwt) {
    return res.status(401).json({ message: 'User not found' });
  }
  req.user = userFromJwt;
  next();
};
voteController.get('/votes', authenticate, async (req, res) => {
  try {
    const votes = await prisma.vote.findMany({
      where: { userId: req.user?.id }
    });

    return res.status(200).json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

voteController.post(
  '/votes',
  authenticate,
  validateRequest({ body: voteSchema }),
  async (req, res) => {
    const { billId, vote, date } = req.body;
    const userId = req.user?.id;

    console.log('Vote request received:', { userId, billId, vote, date });

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
      const newVote = await prisma.vote.create({
        data: {
          userId,
          billId,
          vote,
          date: date as Date
        }
      });

      console.log('Vote recorded:', newVote);
      res.status(201).json(newVote);
    } catch (error) {
      console.error('Error posting vote:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export { voteController };
