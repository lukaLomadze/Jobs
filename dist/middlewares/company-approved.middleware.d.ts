import { NestMiddleware } from '@nestjs/common';
import { Model } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { User } from '../users/schema/user.schema';
import { Company } from '../companies/schema/company.schema';
export declare class CompanyApprovedMiddleware implements NestMiddleware {
    private userModel;
    private companyModel;
    constructor(userModel: Model<User>, companyModel: Model<Company>);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
