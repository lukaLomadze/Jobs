import { Model } from 'mongoose';
import { Vacancy } from './schema/vacancy.schema';
import { Company } from '../companies/schema/company.schema';
import { User } from '../users/schema/user.schema';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
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
export declare class VacanciesService {
    private vacancyModel;
    private companyModel;
    private userModel;
    constructor(vacancyModel: Model<Vacancy>, companyModel: Model<Company>, userModel: Model<User>);
    private getCompanyForUser;
    create(userId: string, dto: CreateVacancyDto): Promise<import("mongoose").Document<unknown, {}, Vacancy, {}, {}> & Vacancy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findPublic(filter: VacancyFilter): Promise<(import("mongoose").FlattenMaps<{
        title: string;
        description: string;
        category: string;
        location: string;
        salaryMin: number;
        salaryMax: number;
        companyId: import("mongoose").Types.ObjectId;
        status: VacancyStatus;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findMyVacancies(userId: string): Promise<(import("mongoose").FlattenMaps<{
        title: string;
        description: string;
        category: string;
        location: string;
        salaryMin: number;
        salaryMax: number;
        companyId: import("mongoose").Types.ObjectId;
        status: VacancyStatus;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOnePublic(id: string): Promise<import("mongoose").FlattenMaps<{
        title: string;
        description: string;
        category: string;
        location: string;
        salaryMin: number;
        salaryMax: number;
        companyId: import("mongoose").Types.ObjectId;
        status: VacancyStatus;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(userId: string, id: string, dto: UpdateVacancyDto): Promise<import("mongoose").Document<unknown, {}, Vacancy, {}, {}> & Vacancy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
    getPendingForAdmin(): Promise<(import("mongoose").FlattenMaps<{
        title: string;
        description: string;
        category: string;
        location: string;
        salaryMin: number;
        salaryMax: number;
        companyId: import("mongoose").Types.ObjectId;
        status: VacancyStatus;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOneForAdmin(id: string): Promise<import("mongoose").FlattenMaps<{
        title: string;
        description: string;
        category: string;
        location: string;
        salaryMin: number;
        salaryMax: number;
        companyId: import("mongoose").Types.ObjectId;
        status: VacancyStatus;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    approve(id: string): Promise<import("mongoose").Document<unknown, {}, Vacancy, {}, {}> & Vacancy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    reject(id: string): Promise<{
        message: string;
    }>;
}
export {};
