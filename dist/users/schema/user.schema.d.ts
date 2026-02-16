import mongoose from 'mongoose';
import { Role } from '../../enum/role.enum';
export declare class User {
    fullName: string;
    email: string;
    password: string;
    role: Role;
    companyId: mongoose.Types.ObjectId;
}
export declare const userSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User, any, {}> & User & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<User> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
