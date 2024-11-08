import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import TrainerRepository from '../repositories/trainerRepository';
import UserRepository from '../repositories/userRepository';
import dotenv from 'dotenv';
dotenv.config();

interface CustomRequest extends Request {
  user?: any; 
}

const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {    
    res.status(401).json({ message: 'Access denied, token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: string };
    
    req.user = decoded;

    const isBlockedTraienr = await TrainerRepository.getIsBlockedTrainer(decoded.id);
    const isBlockedUser = await UserRepository.getIsBlockedUser(decoded.id);

// console.log('isBlockedTraienr', isBlockedTraienr);

    if (isBlockedTraienr) {
      res.status(403).json({ message: 'Access denied, account is blocked' });
      return;
    }

    if(isBlockedUser) {
      res.status(403).json({ message: 'Access denied, account is blocked' });
      return;
    }

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired' });
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
};

export default authMiddleware;
