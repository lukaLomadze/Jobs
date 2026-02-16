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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const applications_service_1 = require("./applications.service");
const create_application_dto_1 = require("./dto/create-application.dto");
const is_auth_guard_1 = require("../guards/is-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const role_enum_1 = require("../enum/role.enum");
const user_id_decorator_1 = require("../decorators/user-id.decorator");
const is_valid_object_id_dto_1 = require("../common/dto/is-valid-object-id.dto");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const aws_s3_service_1 = require("../aws-s3/aws-s3.service");
let ApplicationsController = class ApplicationsController {
    applicationsService;
    awsS3Service;
    constructor(applicationsService, awsS3Service) {
        this.applicationsService = applicationsService;
        this.awsS3Service = awsS3Service;
    }
    apply(userId, body, file) {
        return this.applicationsService.apply(userId, body.vacancyId, file);
    }
    getMyApplications(userId) {
        return this.applicationsService.getUserApplications(userId);
    }
    getCompanyApplications(userId) {
        return this.applicationsService.getCompanyApplications(userId);
    }
    getAllForAdmin(companyId) {
        return this.applicationsService.getAllForAdmin(companyId);
    }
    getForVacancy(userId, { id }) {
        return this.applicationsService.getApplicationsForVacancy(userId, id);
    }
    async getCvSignedUrl(fileKey) {
        if (!fileKey) {
            throw new common_1.BadRequestException('File key is required');
        }
        const signedUrl = await this.awsS3Service.getSignedUrl(fileKey);
        return { url: signedUrl };
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('cv')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Apply for a vacancy',
        description: 'Submits a job application with CV upload. User only.'
    }),
    (0, swagger_1.ApiBody)({
        description: 'Application data with CV file',
        schema: {
            type: 'object',
            properties: {
                vacancyId: {
                    type: 'string',
                    description: 'ID of the vacancy to apply for'
                },
                cv: {
                    type: 'string',
                    format: 'binary',
                    description: 'CV file (PDF, DOC, DOCX)',
                },
            },
            required: ['vacancyId', 'cv'],
        },
    }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_application_dto_1.CreateApplicationDto, Object]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "apply", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my applications',
        description: 'Returns all job applications submitted by the authenticated user'
    }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "getMyApplications", null);
__decorate([
    (0, common_1.Get)('company'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.COMPANY),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get company applications',
        description: 'Returns all applications for jobs posted by the authenticated company'
    }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "getCompanyApplications", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all applications (Admin)',
        description: 'Returns all applications. Admin only. Optionally filter by company.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'companyId', required: false,
        description: 'Filter by company ID'
    }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "getAllForAdmin", null);
__decorate([
    (0, common_1.Get)('vacancy/:id'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.COMPANY),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get applications for a vacancy',
        description: 'Returns all applications for a specific vacancy. Company only (owner).'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vacancy ID', type: String }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, is_valid_object_id_dto_1.IsValidObjectId]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "getForVacancy", null);
__decorate([
    (0, common_1.Get)('cv-url'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get signed URL for CV',
        description: 'Returns a signed URL to view the CV PDF. Available to admin and company.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'fileKey', required: true, description: 'CV file key stored in database' }),
    __param(0, (0, common_1.Query)('fileKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "getCvSignedUrl", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('applications'),
    (0, common_1.Controller)('applications'),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService,
        aws_s3_service_1.AwsS3Service])
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map