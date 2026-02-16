import mongoose from 'mongoose';
import { VacancyStatus } from '../../enum/vacancy-status.enum';
export declare class Vacancy {
    title: string;
    description: string;
    category: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    companyId: mongoose.Types.ObjectId;
    status: VacancyStatus;
}
export declare const vacancySchema: mongoose.Schema<Vacancy, mongoose.Model<Vacancy, any, any, any, mongoose.Document<unknown, any, Vacancy, any, {}> & Vacancy & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Vacancy, mongoose.Document<unknown, {}, mongoose.FlatRecord<Vacancy>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<Vacancy> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
