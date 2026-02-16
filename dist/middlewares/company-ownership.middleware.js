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
exports.CompanyOwnershipMiddleware = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_enum_1 = require("../enum/role.enum");
let CompanyOwnershipMiddleware = class CompanyOwnershipMiddleware {
    userModel;
    companyModel;
    constructor(userModel, companyModel) {
        this.userModel = userModel;
        this.companyModel = companyModel;
    }
    async use(req, res, next) {
        const userId = req['userId'];
        const companyId = req.params.id;
        if (!userId) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== role_enum_1.Role.COMPANY) {
            throw new common_1.ForbiddenException('Only company users can access this');
        }
        if (user.companyId?.toString() !== companyId) {
            throw new common_1.ForbiddenException('Not your company');
        }
        next();
    }
};
exports.CompanyOwnershipMiddleware = CompanyOwnershipMiddleware;
exports.CompanyOwnershipMiddleware = CompanyOwnershipMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('user')),
    __param(1, (0, mongoose_1.InjectModel)('company')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CompanyOwnershipMiddleware);
//# sourceMappingURL=company-ownership.middleware.js.map