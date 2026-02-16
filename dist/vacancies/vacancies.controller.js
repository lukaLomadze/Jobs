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
exports.VacanciesController = void 0;
const common_1 = require("@nestjs/common");
const vacancies_service_1 = require("./vacancies.service");
const create_vacancy_dto_1 = require("./dto/create-vacancy.dto");
const update_vacancy_dto_1 = require("./dto/update-vacancy.dto");
const is_auth_guard_1 = require("../guards/is-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const role_enum_1 = require("../enum/role.enum");
const user_id_decorator_1 = require("../decorators/user-id.decorator");
const is_valid_object_id_dto_1 = require("../common/dto/is-valid-object-id.dto");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class VacancyFilterQuery {
    search;
    category;
    location;
    salaryMin;
    salaryMax;
    page = 1;
    take = 30;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VacancyFilterQuery.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VacancyFilterQuery.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VacancyFilterQuery.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], VacancyFilterQuery.prototype, "salaryMin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], VacancyFilterQuery.prototype, "salaryMax", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], VacancyFilterQuery.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Object)
], VacancyFilterQuery.prototype, "take", void 0);
let VacanciesController = class VacanciesController {
    vacanciesService;
    constructor(vacanciesService) {
        this.vacanciesService = vacanciesService;
    }
    getPendingForAdmin() {
        return this.vacanciesService.getPendingForAdmin();
    }
    approve({ id }) {
        return this.vacanciesService.approve(id);
    }
    reject({ id }) {
        return this.vacanciesService.reject(id);
    }
    getOneForAdmin({ id }) {
        return this.vacanciesService.findOneForAdmin(id);
    }
    getMyVacancies(userId) {
        return this.vacanciesService.findMyVacancies(userId);
    }
    create(userId, dto) {
        return this.vacanciesService.create(userId, dto);
    }
    update(userId, { id }, dto) {
        return this.vacanciesService.update(userId, id, dto);
    }
    remove(userId, { id }) {
        return this.vacanciesService.remove(userId, id);
    }
    findPublic(query) {
        return this.vacanciesService.findPublic(query);
    }
    findOne({ id }) {
        return this.vacanciesService.findOnePublic(id);
    }
};
exports.VacanciesController = VacanciesController;
__decorate([
    (0, common_1.Get)('admin/pending'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending vacancies (Admin)', description: 'Returns all vacancies awaiting approval. Admin only.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "getPendingForAdmin", null);
__decorate([
    (0, common_1.Patch)('admin/:id/approve'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Approve vacancy (Admin)', description: 'Approves a pending vacancy. Admin only.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vacancy ID', type: String }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [is_valid_object_id_dto_1.IsValidObjectId]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)('admin/:id/reject'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reject vacancy (Admin)', description: 'Rejects a pending vacancy. Admin only.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vacancy ID', type: String }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [is_valid_object_id_dto_1.IsValidObjectId]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "reject", null);
__decorate([
    (0, common_1.Get)('admin/:id'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get vacancy by ID (Admin)', description: 'Returns a single vacancy by ID. Admin only.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vacancy ID', type: String }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [is_valid_object_id_dto_1.IsValidObjectId]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "getOneForAdmin", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.COMPANY),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my vacancies', description: 'Returns all vacancies created by the authenticated company' }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "getMyVacancies", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.COMPANY),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create vacancy', description: 'Creates a new vacancy. Company only. Requires approval.' }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_vacancy_dto_1.CreateVacancyDto]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.COMPANY),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update vacancy', description: 'Updates an existing vacancy. Company only (owner).' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vacancy ID', type: String }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, is_valid_object_id_dto_1.IsValidObjectId,
        update_vacancy_dto_1.UpdateVacancyDto]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.COMPANY),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete vacancy', description: 'Deletes a vacancy. Company only (owner).' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vacancy ID', type: String }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, is_valid_object_id_dto_1.IsValidObjectId]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get public vacancies', description: 'Returns a public list of approved vacancies with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search in title and description' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Filter by category' }),
    (0, swagger_1.ApiQuery)({ name: 'location', required: false, description: 'Filter by location' }),
    (0, swagger_1.ApiQuery)({ name: 'salaryMin', required: false, description: 'Minimum salary' }),
    (0, swagger_1.ApiQuery)({ name: 'salaryMax', required: false, description: 'Maximum salary' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, description: 'Number of items per page (default: 30)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VacancyFilterQuery]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single vacancy', description: 'Returns a single approved vacancy by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vacancy ID', type: String }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [is_valid_object_id_dto_1.IsValidObjectId]),
    __metadata("design:returntype", void 0)
], VacanciesController.prototype, "findOne", null);
exports.VacanciesController = VacanciesController = __decorate([
    (0, swagger_1.ApiTags)('vacancies'),
    (0, common_1.Controller)('vacancies'),
    __metadata("design:paramtypes", [vacancies_service_1.VacanciesService])
], VacanciesController);
//# sourceMappingURL=vacancies.controller.js.map