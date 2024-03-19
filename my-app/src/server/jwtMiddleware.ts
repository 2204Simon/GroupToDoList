// jwt.js
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

// Secret key for JWT signing and encryption
const secret = 'your-secret-key';

// Function to generate a new token
export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
}

// Middleware to validate token
export const authenticateJWT = expressJwt.expressjwt({
  secret,
  algorithms: ['HS256'],
  getToken: function fromCookie(req:any) {
    if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  }
});