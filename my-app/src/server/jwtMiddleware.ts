// jwt.js
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'

// Secret key for JWT signing and encryption
const secret = 'your-secret-key'

// Function to generate a new token
export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, secret, { expiresIn: '8h' })
}

// Middleware to validate token
export const authenticateJWT = expressJwt
  .expressjwt({
    secret,
    algorithms: ['HS256'],
    getToken: function fromCookie(req: any) {
      console.log(req.cookies, 'req.cookies')
      const userId = getUserIdFromToken(req.cookies.token)
      console.log(userId, 'userId')
      if (req.cookies && req.cookies.token) {
        return req.cookies.token
      }
      return null
    },
  })
  .unless({ path: ['/api/users', '/api/login'] })

export function getUserIdFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, secret)
    return decoded
  } catch (err) {
    console.error('Failed to extract userId from token', err)
    return null
  }
}
