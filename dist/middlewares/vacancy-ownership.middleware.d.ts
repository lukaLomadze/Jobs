import { NestMiddleware } from '@nestjs/common';
import { Model } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { User } from '../users/schema/user.schema';
import { Vacancy } from '../vacancies/schema/vacancy.schema';
export declare class VacancyOwnershipMiddleware implements NestMiddleware {
    private userModel;
    private vacancyModel;
    constructor(userModel: Model<User>, vacancyModel: Model<Vacancy>);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
