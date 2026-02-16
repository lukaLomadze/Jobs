import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { IsValidObjectId } from '../common/dto/is-valid-object-id.dto';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
export declare class ApplicationsController {
    private readonly applicationsService;
    private readonly awsS3Service;
    constructor(applicationsService: ApplicationsService, awsS3Service: AwsS3Service);
    apply(userId: string, body: CreateApplicationDto, file: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, import("./schema/application.schema").Application, {}, {}> & import("./schema/application.schema").Application & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMyApplications(userId: string): Promise<(import("mongoose").FlattenMaps<{
        vacancyId: import("mongoose").Types.ObjectId;
        userId: import("mongoose").Types.ObjectId;
        cvFileUrl: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getCompanyApplications(userId: string): Promise<(import("mongoose").FlattenMaps<{
        vacancyId: import("mongoose").Types.ObjectId;
        userId: import("mongoose").Types.ObjectId;
        cvFileUrl: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getAllForAdmin(companyId?: string): Promise<(import("mongoose").FlattenMaps<{
        vacancyId: import("mongoose").Types.ObjectId;
        userId: import("mongoose").Types.ObjectId;
        cvFileUrl: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getForVacancy(userId: string, { id }: IsValidObjectId): Promise<(import("mongoose").FlattenMaps<{
        vacancyId: import("mongoose").Types.ObjectId;
        userId: import("mongoose").Types.ObjectId;
        cvFileUrl: string;
    }> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getCvSignedUrl(fileKey: string): Promise<{
        url: string;
    }>;
}
