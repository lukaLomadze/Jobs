import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vacancy } from './schema/vacancy.schema';
import { Company } from '../companies/schema/company.schema';
import { User } from '../users/schema/user.schema';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { Role } from '../enum/role.enum';
import { VacancyStatus } from '../enum/vacancy-status.enum';

interface VacancyFilter {
  search?: string;
  category?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  take?: number;
}

@Injectable()
export class VacanciesService {
  constructor(
    @InjectModel('vacancy') private vacancyModel: Model<Vacancy>,
    @InjectModel('company') private companyModel: Model<Company>,
    @InjectModel('user') private userModel: Model<User>,
  ) {}

  private async getCompanyForUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== Role.COMPANY || !user.companyId) {
      throw new ForbiddenException('Only company users can manage vacancies');
    }
    const company = await this.companyModel.findById(user.companyId);
    if (!company) throw new NotFoundException('Company not found');
    // Company approval check is handled by middleware
    return company;
  }

  async create(userId: string, dto: CreateVacancyDto) {
    const company = await this.getCompanyForUser(userId);
    const vacancy = await this.vacancyModel.create({
      ...dto,
      companyId: company._id,
      status: VacancyStatus.PENDING,
    });
    return vacancy;
  }

  async findPublic(filter: VacancyFilter) {
    const {
      search,
      category,
      location,
      salaryMin,
      salaryMax,
      page = 1,
      take = 30,
    } = filter;

    const query: any = { status: VacancyStatus.APPROVED };

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ title: regex }, { description: regex }];
    }
    if (category) {
      query.category = new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    }
    if (location) {
      query.location = new RegExp(`^${location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    }

    if (salaryMin !== undefined || salaryMax !== undefined) {
      query.$and = [];
      if (salaryMin !== undefined) {
        query.$and.push({
          $or: [
            { salaryMin: { $gte: salaryMin } },
            { salaryMax: { $gte: salaryMin } },
          ],
        });
      }
      if (salaryMax !== undefined) {
        query.$and.push({
          $or: [
            { salaryMax: { $lte: salaryMax } },
            { salaryMin: { $lte: salaryMax } },
          ],
        });
      }
      if (!query.$and.length) {
        delete query.$and;
      }
    }

    const skip = (page - 1) * take;

    return this.vacancyModel
      .find(query)
      .populate('companyId')
      .skip(skip)
      .limit(take)
      .lean();
  }

  async findMyVacancies(userId: string) {
    const company = await this.getCompanyForUser(userId);
    return this.vacancyModel
      .find({ companyId: company._id })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOnePublic(id: string) {
    const vacancy = await this.vacancyModel
      .findOne({ _id: id, status: VacancyStatus.APPROVED })
      .populate('companyId')
      .lean();
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async update(userId: string, id: string, dto: UpdateVacancyDto) {
    const company = await this.getCompanyForUser(userId);
    const vacancy = await this.vacancyModel.findOneAndUpdate(
      { _id: id, companyId: company._id },
      dto,
      { new: true },
    );
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async remove(userId: string, id: string) {
    const company = await this.getCompanyForUser(userId);
    const vacancy = await this.vacancyModel.findOneAndDelete({
      _id: id,
      companyId: company._id,
    });
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return { message: 'Vacancy deleted' };
  }

  async getPendingForAdmin() {
    return this.vacancyModel
      .find({ status: VacancyStatus.PENDING })
      .populate('companyId')
      .lean();
  }

  async findOneForAdmin(id: string) {
    const vacancy = await this.vacancyModel
      .findById(id)
      .populate('companyId')
      .lean();
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async approve(id: string) {
    const vacancy = await this.vacancyModel.findByIdAndUpdate(
      id,
      { status: VacancyStatus.APPROVED },
      { new: true },
    );
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async reject(id: string) {
    const vacancy = await this.vacancyModel.findByIdAndDelete(id);
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return { message: 'Vacancy rejected and deleted' };
  }
}

