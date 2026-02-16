"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ApplicationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const aws_s3_service_1 = require("../aws-s3/aws-s3.service");
const email_sender_service_1 = require("../email-sender/email-sender.service");
const vacancy_status_enum_1 = require("../enum/vacancy-status.enum");
const role_enum_1 = require("../enum/role.enum");
let ApplicationsService = ApplicationsService_1 = class ApplicationsService {
    applicationModel;
    vacancyModel;
    companyModel;
    userModel;
    awsS3Service;
    emailSenderService;
    logger = new common_1.Logger(ApplicationsService_1.name);
    constructor(applicationModel, vacancyModel, companyModel, userModel, awsS3Service, emailSenderService) {
        this.applicationModel = applicationModel;
        this.vacancyModel = vacancyModel;
        this.companyModel = companyModel;
        this.userModel = userModel;
        this.awsS3Service = awsS3Service;
        this.emailSenderService = emailSenderService;
    }
    async apply(userId, vacancyId, file) {
        if (!file) {
            throw new common_1.ForbiddenException('CV file is required');
        }
        if (!file.mimetype.includes('pdf')) {
            throw new common_1.ForbiddenException('Only PDF files are allowed');
        }
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== role_enum_1.Role.USER) {
            throw new common_1.ForbiddenException('Only default users can apply');
        }
        const vacancy = await this.vacancyModel
            .findById(vacancyId)
            .populate('companyId')
            .exec();
        if (!vacancy)
            throw new common_1.NotFoundException('Vacancy not found');
        if (vacancy.status !== vacancy_status_enum_1.VacancyStatus.APPROVED) {
            throw new common_1.ForbiddenException('Cannot apply to non-approved vacancy');
        }
        const cvFileUrl = await this.awsS3Service.uploadPdf(file.buffer);
        const application = await this.applicationModel.create({
            vacancyId: vacancy._id,
            userId: user._id,
            cvFileUrl,
        });
        const company = vacancy.companyId;
        const frontendUrl = process.env.FRONT_URL ?? 'http://localhost:3000';
        try {
            await this.emailSenderService.sendApplicationNotification(company.email, user.fullName, vacancy.title, frontendUrl);
        }
        catch (err) {
            this.logger.warn(`Failed to send application notification email to ${company.email}: ${err instanceof Error ? err.message : err}`);
        }
        return application;
    }
    async getUserApplications(userId) {
        return this.applicationModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .populate({
            path: 'vacancyId',
            populate: { path: 'companyId' },
        })
            .lean();
    }
    async getCompanyApplications(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== role_enum_1.Role.COMPANY || !user.companyId) {
            throw new common_1.ForbiddenException('Only company users can see applications');
        }
        const vacancies = await this.vacancyModel
            .find({ companyId: user.companyId })
            .select('_id')
            .lean();
        const vacancyIds = vacancies.map((v) => v._id);
        return this.applicationModel
            .find({ vacancyId: { $in: vacancyIds } })
            .populate('userId', 'fullName email')
            .populate('vacancyId')
            .sort({ createdAt: -1 })
            .lean();
    }
    async getApplicationsForVacancy(userId, vacancyId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== role_enum_1.Role.COMPANY || !user.companyId) {
            throw new common_1.ForbiddenException('Only company users can see applications');
        }
        const vacancy = await this.vacancyModel.findById(vacancyId);
        if (!vacancy)
            throw new common_1.NotFoundException('Vacancy not found');
        if (vacancy.companyId.toString() !== user.companyId.toString()) {
            throw new common_1.ForbiddenException('Not your vacancy');
        }
        return this.applicationModel
            .find({ vacancyId: new mongoose_2.Types.ObjectId(vacancyId) })
            .populate('userId', 'fullName email')
            .populate('vacancyId')
            .sort({ createdAt: -1 })
            .lean();
    }
    async getAllForAdmin(companyId) {
        const filter = {};
        if (companyId) {
            const vacancies = await this.vacancyModel
                .find({ companyId })
                .select('_id')
                .lean();
            const vacancyIds = vacancies.map((v) => v._id);
            filter.vacancyId = { $in: vacancyIds };
        }
        return this.applicationModel
            .find(filter)
            .populate('userId', 'fullName email')
            .populate({
            path: 'vacancyId',
            populate: { path: 'companyId', select: 'name email' },
        })
            .sort({ createdAt: -1 })
            .lean();
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = ApplicationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('application')),
    __param(1, (0, mongoose_1.InjectModel)('vacancy')),
    __param(2, (0, mongoose_1.InjectModel)('company')),
    __param(3, (0, mongoose_1.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        aws_s3_service_1.AwsS3Service,
        email_sender_service_1.EmailSenderService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map