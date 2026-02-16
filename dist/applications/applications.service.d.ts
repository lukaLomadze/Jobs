import { Model, Types } from 'mongoose';
import { Application } from './schema/application.schema';
import { Vacancy } from '../vacancies/schema/vacancy.schema';
import { Company } from '../companies/schema/company.schema';
import { User } from '../users/schema/user.schema';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { EmailSenderService } from '../email-sender/email-sender.service';
export declare class ApplicationsService {
    private applicationModel;
    private vacancyModel;
    private companyModel;
    private userModel;
    private awsS3Service;
    private emailSenderService;
    private readonly logger;
    constructor(applicationModel: Model<Application>, vacancyModel: Model<Vacancy>, companyModel: Model<Company>, userModel: Model<User>, awsS3Service: AwsS3Service, emailSenderService: EmailSenderService);
    apply(userId: string, vacancyId: string, file: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, Application, {}, {}> & Application & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getUserApplications(userId: string): Promise<(import("mongoose").FlattenMaps<{
        vacancyId: Types.ObjectId;
        userId: Types.ObjectId;
        cvFileUrl: string;
    }> & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getCompanyApplications(userId: string): Promise<(import("mongoose").FlattenMaps<{
        vacancyId: Types.ObjectId;
        userId: Types.ObjectId;
        cvFileUrl: string;
    }> & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getApplicationsForVacancy(userId: string, vacancyId: string): Promise<(import("mongoose").FlattenMaps<{
        vacancyId: Types.ObjectId;
        userId: Types.ObjectId;
        cvFileUrl: string;
    }> & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getAllForAdmin(companyId?: string): Promise<(import("mongoose").FlattenMaps<{
        vacancyId: Types.ObjectId;
        userId: Types.ObjectId;
        cvFileUrl: string;
    }> & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
