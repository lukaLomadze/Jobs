import { Model } from 'mongoose';
import { User } from './schema/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findByEmail(email: string, selectPassword?: boolean): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
