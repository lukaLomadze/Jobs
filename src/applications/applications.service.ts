import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application } from './schema/application.schema';
import { Vacancy } from '../vacancies/schema/vacancy.schema';
import { Company } from '../companies/schema/company.schema';
import { User } from '../users/schema/user.schema';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { EmailSenderService } from '../email-sender/email-sender.service';
import { VacancyStatus } from '../enum/vacancy-status.enum';
import { Role } from '../enum/role.enum';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectModel('application') private applicationModel: Model<Application>,
    @InjectModel('vacancy') private vacancyModel: Model<Vacancy>,
    @InjectModel('company') private companyModel: Model<Company>,
    @InjectModel('user') private userModel: Model<User>,
    private awsS3Service: AwsS3Service,
    private emailSenderService: EmailSenderService,
  ) {}

  async apply(
    userId: string,
    vacancyId: string,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new ForbiddenException('CV file is required');
    }

    if (!file.mimetype.includes('pdf')) {
      throw new ForbiddenException('Only PDF files are allowed');
    }

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== Role.USER) {
      throw new ForbiddenException('Only default users can apply');
    }

    const vacancy = await this.vacancyModel
      .findById(vacancyId)
      .populate('companyId')
      .exec();
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    if (vacancy.status !== VacancyStatus.APPROVED) {
      throw new ForbiddenException('Cannot apply to non-approved vacancy');
    }

    const cvFileUrl = await this.awsS3Service.uploadPdf(file.buffer);

    const application = await this.applicationModel.create({
      vacancyId: vacancy._id,
      userId: user._id,
      cvFileUrl,
    });

    const company = vacancy.companyId as unknown as Company;
    const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:3000';
    try {
     
      await this.emailSenderService.sendApplicationNotification(
        company.email,
        user.fullName,
        vacancy.title,
        frontendUrl,
      );
    } catch (err) {
      this.logger.warn(
        `Failed to send application notification email to ${company.email}: ${err instanceof Error ? err.message : err}`,
      );
    }

    return application;
  }

  async getUserApplications(userId: string) {
    return this.applicationModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'vacancyId',
        populate: { path: 'companyId' },
      })
      .lean();
  }

  async getCompanyApplications(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== Role.COMPANY || !user.companyId) {
      throw new ForbiddenException('Only company users can see applications');
    }

    const vacancies = await this.vacancyModel
      .find({ companyId: user.companyId })
      .select('_id')
      .lean();
    const vacancyIds = vacancies.map((v) => v._id as Types.ObjectId);

    return this.applicationModel
      .find({ vacancyId: { $in: vacancyIds } })
      .populate('userId', 'fullName email')
      .populate('vacancyId')
      .sort({ createdAt: -1 })
      .lean();
  }

  async getApplicationsForVacancy(userId: string, vacancyId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== Role.COMPANY || !user.companyId) {
      throw new ForbiddenException('Only company users can see applications');
    }

    const vacancy = await this.vacancyModel.findById(vacancyId);
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    if (vacancy.companyId.toString() !== user.companyId.toString()) {
      throw new ForbiddenException('Not your vacancy');
    }

    return this.applicationModel
      .find({ vacancyId : new Types.ObjectId(vacancyId) })
      .populate('userId', 'fullName email')
      .populate('vacancyId')
      .sort({ createdAt: -1 })
      .lean();
  }

  async getAllForAdmin(companyId?: string) {
    const filter: any = {};
    if (companyId) {
      const vacancies = await this.vacancyModel
        .find({ companyId })
        .select('_id')
        .lean();
      const vacancyIds = vacancies.map((v) => v._id as Types.ObjectId);
      filter.vacancyId = { $in: vacancyIds };
    }

    return this.applicationModel
      .find(filter)
      .populate('userId', 'fullName email')
      .populate({
        path: 'vacancyId',
        populate: { path: 'companyId', select: 'name email' },
      })
      .sort({ createdAt: -1 })
      .lean();
  }
}

