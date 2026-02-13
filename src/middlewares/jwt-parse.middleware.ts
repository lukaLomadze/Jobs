import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

/**
 * Parses JWT from Authorization header and sets req.userId and req.role.
 * Does not reject unauthenticated requests (guards do that on protected routes).
 */
@Injectable()
export class JwtParseMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];
    if (auth?.startsWith('Bearer ')) {
      const token = auth.slice(7);
      try {
        const payload = this.jwtService.verify(token);
        req['userId'] = payload.userId;
        req['role'] = payload.role;
      } catch {
        // Invalid or expired token – leave userId/role undefined
      }
    }
    next();
  }
}
