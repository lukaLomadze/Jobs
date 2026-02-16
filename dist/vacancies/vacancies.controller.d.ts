import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { IsValidObjectId } from '../common/dto/is-valid-object-id.dto';
declare class VacancyFilterQuery {
    search?: string;
    category?: string;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    page: number;
    take: number;
}
export declare class VacanciesController {
    private readonly vacanciesService;
    constructor(vacanciesService: VacanciesService);
    getPendingForAdmin(): Promise<(import("mongoose").FlattenMaps<{
        title: string;
        description: string;
        category: string;
        location: string;
        salaryMin: number;
        salaryMax: number;
        companyId: import("mongoose").Types.ObjectId;
        status: import("../enum/vacancy-status.enum").VacancyStatus;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    approve({ id }: IsValidObjectId): Promise<import("mongoose").Document<unknown, {}, import("./schema/vacancy.schema").Vacancy, {}, {}> & import("./schema/vacancy.schema").Vacancy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    reject({ id }: IsValidObjectId): Promise<{
        message: string;
    }>;
    getOneForAdmin({ id }: IsValidObjectId): Promise<import("mongoose").FlattenMaps<{
        title: string;
        description: string;
        category: string;
        location: string;
        salaryMin: number;
        salaryMax: number;
        companyId: import("mongoose").Types.ObjectId;
        status: import("../enum/vacancy-status.enum").VacancyStatus;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMyVacancies(userId: string): Promise<(import("mongoose").FlattenMaps<{
        title: string;
        description: string;
        category: string;
        location: string;
        salaryMin: number;
        salaryMax: number;
        companyId: import("mongoose").Types.ObjectId;
        status: import("../enum/vacancy-status.enum").VacancyStatus;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    create(userId: string, dto: CreateVacancyDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/vacancy.schema").Vacancy, {}, {}> & import("./schema/vacancy.schema").Vacancy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(userId: string, { id }: IsValidObjectId, dto: UpdateVacancyDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/vacancy.schema").Vacancy, {}, {}> & import("./schema/vacancy.schema").Vacancy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    remove(userId: string, { id }: IsValidObjectId): Promise<{
        message: string;
    }>;
    findPublic(query: VacancyFilterQuery): Promise<(import("mongoose").FlattenMaps<{
        title: string;
        description: string;
        category: string;
        location: string;
        salaryMin: number;
        salaryMax: number;
        companyId: import("mongoose").Types.ObjectId;
        status: import("../enum/vacancy-status.enum").VacancyStatus;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne({ id }: IsValidObjectId): Promise<import("mongoose").FlattenMaps<{
        title: string;
        description: string;
        category: string;
        location: string;
        salaryMin: number;
        salaryMax: number;
        companyId: import("mongoose").Types.ObjectId;
        status: import("../enum/vacancy-status.enum").VacancyStatus;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
export {};
