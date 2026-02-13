import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Logs each request with timestamp, method, url, and requestId (if set).
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = req['requestId'] ?? '-';
    console.log(
      `[${new Date().toISOString()}] [${requestId}] ${req.method} ${req.url}`,
    );
    next();
  }
}

/** Standalone function for use in main.ts (runs before Nest middlewares). */
export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}
