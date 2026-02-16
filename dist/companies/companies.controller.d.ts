import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { IsValidObjectId } from '../common/dto/is-valid-object-id.dto';
declare class PaginationQuery {
    page: number;
    take: number;
}
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    getMyCompany(userId: string): Promise<import("mongoose").FlattenMaps<{
        name: string;
        description: string;
        email: string;
        phone: string;
        website: string;
        logo: string;
        userId: import("mongoose").Types.ObjectId;
        isApproved: boolean;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(userId: string, { id }: IsValidObjectId, dto: UpdateCompanyDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/company.schema").Company, {}, {}> & import("./schema/company.schema").Company & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(query: PaginationQuery): Promise<(import("mongoose").FlattenMaps<{
        name: string;
        description: string;
        email: string;
        phone: string;
        website: string;
        logo: string;
        userId: import("mongoose").Types.ObjectId;
        isApproved: boolean;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getPending(): Promise<(import("mongoose").FlattenMaps<{
        name: string;
        description: string;
        email: string;
        phone: string;
        website: string;
        logo: string;
        userId: import("mongoose").Types.ObjectId;
        isApproved: boolean;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    approve({ id }: IsValidObjectId): Promise<import("mongoose").Document<unknown, {}, import("./schema/company.schema").Company, {}, {}> & import("./schema/company.schema").Company & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    ban({ id }: IsValidObjectId): Promise<import("mongoose").Document<unknown, {}, import("./schema/company.schema").Company, {}, {}> & import("./schema/company.schema").Company & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
export {};
