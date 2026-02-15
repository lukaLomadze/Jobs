import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';


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

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}
