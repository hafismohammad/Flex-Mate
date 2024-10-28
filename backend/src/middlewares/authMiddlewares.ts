import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface CustomRequest extends Request {
  user?: any; 
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1];
  // console.log('Middleware hit');

  if (!token) {    
    res.status(401).json({ message: 'Access denied, token missing' });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    req.user = decoded; 
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
        console.log('Token has expired');
        
      res.status(401).json({ message: 'Token has expired' });
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
};

export default authMiddleware;
