import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';

export function generateAdminToken(email: string): string {
  /// function for testing purposes
  const payload = { loggerEmail: email }; // should be gmail.com
  return jwt.sign(payload, CONFIG.JWT_PRIVATE_KEY, { expiresIn: '1h' });
}
