"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const companies_controller_1 = require("./companies.controller");
const companies_service_1 = require("./companies.service");
const company_schema_1 = require("./schema/company.schema");
const user_schema_1 = require("../users/schema/user.schema");
const roles_guard_1 = require("../guards/roles.guard");
const company_ownership_middleware_1 = require("../middlewares/company-ownership.middleware");
const admin_only_middleware_1 = require("../middlewares/admin-only.middleware");
let CompaniesModule = class CompaniesModule {
    configure(consumer) {
        consumer
            .apply(company_ownership_middleware_1.CompanyOwnershipMiddleware)
            .forRoutes({
            path: 'companies/:id',
            method: common_1.RequestMethod.PATCH,
        });
        consumer
            .apply(admin_only_middleware_1.AdminOnlyMiddleware)
            .forRoutes({ path: 'companies', method: common_1.RequestMethod.GET }, { path: 'companies/pending', method: common_1.RequestMethod.GET }, { path: 'companies/:id/approve', method: common_1.RequestMethod.PATCH }, { path: 'companies/:id/ban', method: common_1.RequestMethod.PATCH });
    }
};
exports.CompaniesModule = CompaniesModule;
exports.CompaniesModule = CompaniesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'company', schema: company_schema_1.companySchema },
                { name: 'user', schema: user_schema_1.userSchema },
            ]),
        ],
        controllers: [companies_controller_1.CompaniesController],
        providers: [companies_service_1.CompaniesService, roles_guard_1.RolesGuard],
        exports: [companies_service_1.CompaniesService],
    })
], CompaniesModule);
//# sourceMappingURL=companies.module.js.map