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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_enum_1 = require("../enum/role.enum");
let CompaniesService = class CompaniesService {
    companyModel;
    userModel;
    constructor(companyModel, userModel) {
        this.companyModel = companyModel;
        this.userModel = userModel;
    }
    async findByUserId(userId) {
        const company = await this.companyModel
            .findOne({ userId })
            .populate('userId', 'fullName email')
            .lean();
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async findById(id) {
        const company = await this.companyModel
            .findById(id)
            .populate('userId', 'fullName email')
            .lean();
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async update(userId, companyId, update) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== role_enum_1.Role.COMPANY || user.companyId?.toString() !== companyId) {
            throw new common_1.ForbiddenException('Not your company');
        }
        const company = await this.companyModel.findByIdAndUpdate(companyId, update, { new: true });
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async findAll(page = 1, take = 30) {
        const skip = (page - 1) * take;
        return this.companyModel
            .find()
            .populate('userId', 'fullName email')
            .skip(skip)
            .limit(take)
            .lean();
    }
    async approve(id) {
        const company = await this.companyModel.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async ban(id) {
        const company = await this.companyModel.findByIdAndUpdate(id, { isApproved: false }, { new: true });
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async getPendingCompanies() {
        return this.companyModel
            .find({ isApproved: false })
            .populate('userId', 'fullName email')
            .lean();
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('company')),
    __param(1, (0, mongoose_1.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map