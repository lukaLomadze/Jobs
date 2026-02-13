import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schema/company.schema';
import { User } from '../users/schema/user.schema';
import { Role } from '../enum/role.enum';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel('company') private companyModel: Model<Company>,
    @InjectModel('user') private userModel: Model<User>,
  ) {}

  async findByUserId(userId: string) {
    const company = await this.companyModel
      .findOne({ userId })
      .populate('userId', 'fullName email')
      .lean();
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findById(id: string) {
    const company = await this.companyModel
      .findById(id)
      .populate('userId', 'fullName email')
      .lean();
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(userId: string, companyId: string, update: Partial<Company>) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== Role.COMPANY || user.companyId?.toString() !== companyId) {
      throw new ForbiddenException('Not your company');
    }

    const company = await this.companyModel.findByIdAndUpdate(
      companyId,
      update,
      { new: true },
    );
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findAll(page = 1, take = 30) {
    const skip = (page - 1) * take;
    return this.companyModel
      .find()
      .populate('userId', 'fullName email')
      .skip(skip)
      .limit(take)
      .lean();
  }

  async approve(id: string) {
    const company = await this.companyModel.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true },
    );
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async ban(id: string) {
    const company = await this.companyModel.findByIdAndUpdate(
      id,
      { isApproved: false },
      { new: true },
    );
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async getPendingCompanies() {
    return this.companyModel
      .find({ isApproved: false })
      .populate('userId', 'fullName email')
      .lean();
  }
}
