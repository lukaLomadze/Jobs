import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Role } from '../enum/role.enum';

/**
 * Ensures the authenticated user has user (job seeker) role.
 * Must run after JwtParseMiddleware.
 */
@Injectable()
export class UserOnlyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req['userId'];
    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }
    if (req['role'] !== Role.USER) {
      throw new ForbiddenException('Only job seekers can access this');
    }
    next();
  }
}
