import mongoose from 'mongoose';
export declare class Company {
    name: string;
    description: string;
    email: string;
    phone: string;
    website: string;
    logo: string;
    userId: mongoose.Types.ObjectId;
    isApproved: boolean;
}
export declare const companySchema: mongoose.Schema<Company, mongoose.Model<Company, any, any, any, mongoose.Document<unknown, any, Company, any, {}> & Company & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Company, mongoose.Document<unknown, {}, mongoose.FlatRecord<Company>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<Company> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
