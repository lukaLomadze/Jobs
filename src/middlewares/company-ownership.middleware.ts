import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { User } from '../users/schema/user.schema';
import { Company } from '../companies/schema/company.schema';
import { Role } from '../enum/role.enum';

@Injectable()
export class CompanyOwnershipMiddleware implements NestMiddleware {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    @InjectModel('company') private companyModel: Model<Company>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req['userId'];
    const companyId = req.params.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.role !== Role.COMPANY) {
      throw new ForbiddenException('Only company users can access this');
    }

    if (user.companyId?.toString() !== companyId) {
      throw new ForbiddenException('Not your company');
    }

    next();
  }
}
