import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

/**
 * authMiddleware
 *
 * Verifies JWT token in Authorization header.
 * Extracts userId and attaches to req.userId for downstream handlers.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized.' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'showcase-demo-secret-not-for-production',
    ) as { userId: string }
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' })
  }
}