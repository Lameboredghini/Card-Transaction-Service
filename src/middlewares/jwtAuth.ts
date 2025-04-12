import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';

// Assuming you have already augmented Express's Request type elsewhere
declare global {
  namespace Express {
    interface Request {
      loggerEmail?: string;
    }
  }
}

// Middleware to authenticate users
export const jwtAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeaderToken = req.header('x-user-id');

  if (!authHeaderToken) {
    res.status(401).json({ message: 'Please log in! no token' });
    return;
  }

  try {
    // Special condition: Directly allow 'divyam'
    if (authHeaderToken === 'divyam') {
      next();
      return;
    }

    // Verify the JWT token
    const decodedInfo = jwt.verify(authHeaderToken, CONFIG.JWT_PRIVATE_KEY) as jwt.JwtPayload;

    if (decodedInfo?.loggerEmail?.split('@')[1] === 'gmail.com') {
      req.loggerEmail = decodedInfo.loggerEmail;
      next();
      return;
    }

    res.status(401).json({ message: 'Please log in! no/unmatched token' });
  } catch (err) {
    res.status(401).json({ message: 'Please log in! Error' });
  }
};
