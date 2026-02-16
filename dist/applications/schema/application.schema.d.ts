import mongoose from 'mongoose';
export declare class Application {
    vacancyId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    cvFileUrl: string;
}
export declare const applicationSchema: mongoose.Schema<Application, mongoose.Model<Application, any, any, any, mongoose.Document<unknown, any, Application, any, {}> & Application & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Application, mongoose.Document<unknown, {}, mongoose.FlatRecord<Application>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<Application> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
