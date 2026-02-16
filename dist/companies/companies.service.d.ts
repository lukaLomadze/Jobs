import { Model } from 'mongoose';
import { Company } from './schema/company.schema';
import { User } from '../users/schema/user.schema';
export declare class CompaniesService {
    private companyModel;
    private userModel;
    constructor(companyModel: Model<Company>, userModel: Model<User>);
    findByUserId(userId: string): Promise<import("mongoose").FlattenMaps<{
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
    findById(id: string): Promise<import("mongoose").FlattenMaps<{
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
    update(userId: string, companyId: string, update: Partial<Company>): Promise<import("mongoose").Document<unknown, {}, Company, {}, {}> & Company & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(page?: number, take?: number): Promise<(import("mongoose").FlattenMaps<{
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
    approve(id: string): Promise<import("mongoose").Document<unknown, {}, Company, {}, {}> & Company & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    ban(id: string): Promise<import("mongoose").Document<unknown, {}, Company, {}, {}> & Company & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getPendingCompanies(): Promise<(import("mongoose").FlattenMaps<{
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
}
