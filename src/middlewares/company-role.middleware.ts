import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Role } from '../enum/role.enum';

/**
 * Ensures the authenticated user has company role.
 * Must run after JwtParseMiddleware.
 */
@Injectable()
export class CompanyRoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req['userId'];
    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }
    if (req['role'] !== Role.COMPANY) {
      throw new ForbiddenException('Only companies can access this');
    }
    next();
  }
}
