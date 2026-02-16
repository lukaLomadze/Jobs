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
exports.CompaniesController = void 0;
const common_1 = require("@nestjs/common");
const companies_service_1 = require("./companies.service");
const is_auth_guard_1 = require("../guards/is-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_id_decorator_1 = require("../decorators/user-id.decorator");
const role_enum_1 = require("../enum/role.enum");
const update_company_dto_1 = require("./dto/update-company.dto");
const is_valid_object_id_dto_1 = require("../common/dto/is-valid-object-id.dto");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class PaginationQuery {
    page = 1;
    take = 30;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Object)
], PaginationQuery.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Object)
], PaginationQuery.prototype, "take", void 0);
let CompaniesController = class CompaniesController {
    companiesService;
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    getMyCompany(userId) {
        return this.companiesService.findByUserId(userId);
    }
    update(userId, { id }, dto) {
        return this.companiesService.update(userId, id, dto);
    }
    findAll(query) {
        return this.companiesService.findAll(query.page, query.take);
    }
    getPending() {
        return this.companiesService.getPendingCompanies();
    }
    approve({ id }) {
        return this.companiesService.approve(id);
    }
    ban({ id }) {
        return this.companiesService.ban(id);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.COMPANY),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current company profile',
        description: 'Returns the company profile for the authenticated company user' }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getMyCompany", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.COMPANY),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update company profile',
        description: 'Updates the company profile for the authenticated company' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Company ID', type: String }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, is_valid_object_id_dto_1.IsValidObjectId,
        update_company_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all companies (Admin)',
        description: 'Returns all companies with pagination. Admin only.' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false,
        description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false,
        description: 'Number of items per page (default: 30, max: 100)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQuery]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending companies (Admin)',
        description: 'Returns all companies awaiting approval. Admin only.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getPending", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Approve company (Admin)',
        description: 'Approves a pending company. Admin only.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Company ID', type: String }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [is_valid_object_id_dto_1.IsValidObjectId]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/ban'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ban company (Admin)',
        description: 'Bans a company. Admin only.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Company ID', type: String }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [is_valid_object_id_dto_1.IsValidObjectId]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "ban", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, swagger_1.ApiTags)('companies'),
    (0, common_1.Controller)('companies'),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);
//# sourceMappingURL=companies.controller.js.map