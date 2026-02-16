"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VacanciesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const vacancies_controller_1 = require("./vacancies.controller");
const vacancies_service_1 = require("./vacancies.service");
const vacancy_schema_1 = require("./schema/vacancy.schema");
const company_schema_1 = require("../companies/schema/company.schema");
const user_schema_1 = require("../users/schema/user.schema");
const roles_guard_1 = require("../guards/roles.guard");
const company_approved_middleware_1 = require("../middlewares/company-approved.middleware");
const vacancy_ownership_middleware_1 = require("../middlewares/vacancy-ownership.middleware");
const admin_only_middleware_1 = require("../middlewares/admin-only.middleware");
let VacanciesModule = class VacanciesModule {
    configure(consumer) {
        consumer
            .apply(company_approved_middleware_1.CompanyApprovedMiddleware)
            .forRoutes({ path: 'vacancies', method: common_1.RequestMethod.POST }, { path: 'vacancies/my', method: common_1.RequestMethod.GET });
        consumer
            .apply(vacancy_ownership_middleware_1.VacancyOwnershipMiddleware)
            .forRoutes({ path: 'vacancies/:id', method: common_1.RequestMethod.PATCH }, { path: 'vacancies/:id', method: common_1.RequestMethod.DELETE });
        consumer
            .apply(admin_only_middleware_1.AdminOnlyMiddleware)
            .forRoutes({ path: 'vacancies/admin/pending', method: common_1.RequestMethod.GET }, { path: 'vacancies/admin/:id', method: common_1.RequestMethod.GET }, { path: 'vacancies/admin/:id/approve', method: common_1.RequestMethod.PATCH }, { path: 'vacancies/admin/:id/reject', method: common_1.RequestMethod.PATCH });
    }
};
exports.VacanciesModule = VacanciesModule;
exports.VacanciesModule = VacanciesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'vacancy', schema: vacancy_schema_1.vacancySchema },
                { name: 'company', schema: company_schema_1.companySchema },
                { name: 'user', schema: user_schema_1.userSchema },
            ]),
        ],
        controllers: [vacancies_controller_1.VacanciesController],
        providers: [vacancies_service_1.VacanciesService, roles_guard_1.RolesGuard],
        exports: [vacancies_service_1.VacanciesService],
    })
], VacanciesModule);
//# sourceMappingURL=vacancies.module.js.map