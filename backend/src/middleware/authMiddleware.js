import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';
dotenv.config();

// Log configuration for debugging (remove in production)
console.log('Auth0 Config:', {
  audience: process.env.AUTH0_AUDIENCE,
  domain: process.env.AUTH0_DOMAIN,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`
});

const authMiddleware = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Auth Error:', err);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }
  
  next(err);
};

export default authMiddleware;
