"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const applications_controller_1 = require("./applications.controller");
const applications_service_1 = require("./applications.service");
const application_schema_1 = require("./schema/application.schema");
const vacancy_schema_1 = require("../vacancies/schema/vacancy.schema");
const company_schema_1 = require("../companies/schema/company.schema");
const user_schema_1 = require("../users/schema/user.schema");
const aws_s3_module_1 = require("../aws-s3/aws-s3.module");
const email_sender_module_1 = require("../email-sender/email-sender.module");
const roles_guard_1 = require("../guards/roles.guard");
const user_only_middleware_1 = require("../middlewares/user-only.middleware");
const company_role_middleware_1 = require("../middlewares/company-role.middleware");
let ApplicationsModule = class ApplicationsModule {
    configure(consumer) {
        consumer.apply(user_only_middleware_1.UserOnlyMiddleware).forRoutes({ path: 'applications', method: common_1.RequestMethod.POST }, { path: 'applications/my', method: common_1.RequestMethod.GET });
        consumer.apply(company_role_middleware_1.CompanyRoleMiddleware).forRoutes({ path: 'applications/company', method: common_1.RequestMethod.GET }, { path: 'applications/vacancy/:id', method: common_1.RequestMethod.GET });
    }
};
exports.ApplicationsModule = ApplicationsModule;
exports.ApplicationsModule = ApplicationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'application', schema: application_schema_1.applicationSchema },
                { name: 'vacancy', schema: vacancy_schema_1.vacancySchema },
                { name: 'company', schema: company_schema_1.companySchema },
                { name: 'user', schema: user_schema_1.userSchema },
            ]),
            aws_s3_module_1.AwsS3Module,
            email_sender_module_1.EmailSenderModule,
        ],
        controllers: [applications_controller_1.ApplicationsController],
        providers: [applications_service_1.ApplicationsService, roles_guard_1.RolesGuard],
    })
], ApplicationsModule);
//# sourceMappingURL=applications.module.js.map