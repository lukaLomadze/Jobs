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
export class CompanyApprovedMiddleware implements NestMiddleware {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    @InjectModel('company') private companyModel: Model<Company>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req['userId'];
    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.role === Role.COMPANY && user.companyId) {
      const company = await this.companyModel.findById(user.companyId);
      if (!company) throw new NotFoundException('Company not found');
      if (!company.isApproved) {
        throw new ForbiddenException('Company is not approved yet');
      }
    }

    next();
  }
}
