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
import { Vacancy } from '../vacancies/schema/vacancy.schema';
import { Role } from '../enum/role.enum';

@Injectable()
export class VacancyOwnershipMiddleware implements NestMiddleware {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    @InjectModel('vacancy') private vacancyModel: Model<Vacancy>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req['userId'];
    const vacancyId = req.params.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.role !== Role.COMPANY || !user.companyId) {
      throw new ForbiddenException('Only company users can access this');
    }

    const vacancy = await this.vacancyModel.findById(vacancyId);
    if (!vacancy) throw new NotFoundException('Vacancy not found');

    if (vacancy.companyId.toString() !== user.companyId.toString()) {
      throw new ForbiddenException('Not your vacancy');
    }

    next();
  }
}
