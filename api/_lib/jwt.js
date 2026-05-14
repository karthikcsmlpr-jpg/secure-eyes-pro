import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_EXPIRY = '7d'; // Token expires in 7 days

export function generateToken(userId, email) {
  try {
    const token = jwt.sign(
      {
        userId,
        email,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      {
        expiresIn: TOKEN_EXPIRY,
        algorithm: 'HS256',
      }
    );
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function extractTokenFromHeader(authHeader) {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }
  
  return parts[1];
}
