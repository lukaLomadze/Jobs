import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Role } from '../enum/role.enum';


@Injectable()
export class AdminOnlyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req['userId'];
    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }
    if (req['role'] !== Role.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
    next();
  }
}
