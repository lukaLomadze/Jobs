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
exports.VacanciesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_enum_1 = require("../enum/role.enum");
const vacancy_status_enum_1 = require("../enum/vacancy-status.enum");
let VacanciesService = class VacanciesService {
    vacancyModel;
    companyModel;
    userModel;
    constructor(vacancyModel, companyModel, userModel) {
        this.vacancyModel = vacancyModel;
        this.companyModel = companyModel;
        this.userModel = userModel;
    }
    async getCompanyForUser(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== role_enum_1.Role.COMPANY || !user.companyId) {
            throw new common_1.ForbiddenException('Only company users can manage vacancies');
        }
        const company = await this.companyModel.findById(user.companyId);
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async create(userId, dto) {
        const company = await this.getCompanyForUser(userId);
        const vacancy = await this.vacancyModel.create({
            ...dto,
            companyId: company._id,
            status: vacancy_status_enum_1.VacancyStatus.PENDING,
        });
        return vacancy;
    }
    async findPublic(filter) {
        const { search, category, location, salaryMin, salaryMax, page = 1, take = 30, } = filter;
        const query = { status: vacancy_status_enum_1.VacancyStatus.APPROVED };
        if (search) {
            const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            query.$or = [{ title: regex }, { description: regex }];
        }
        if (category) {
            query.category = new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
        }
        if (location) {
            query.location = new RegExp(`^${location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
        }
        if (salaryMin !== undefined || salaryMax !== undefined) {
            query.$and = [];
            if (salaryMin !== undefined) {
                query.$and.push({
                    $or: [
                        { salaryMin: { $gte: salaryMin } },
                        { salaryMax: { $gte: salaryMin } },
                    ],
                });
            }
            if (salaryMax !== undefined) {
                query.$and.push({
                    $or: [
                        { salaryMax: { $lte: salaryMax } },
                        { salaryMin: { $lte: salaryMax } },
                    ],
                });
            }
            if (!query.$and.length) {
                delete query.$and;
            }
        }
        const skip = (page - 1) * take;
        return this.vacancyModel
            .find(query)
            .populate('companyId')
            .skip(skip)
            .limit(take)
            .lean();
    }
    async findMyVacancies(userId) {
        const company = await this.getCompanyForUser(userId);
        return this.vacancyModel
            .find({ companyId: company._id })
            .sort({ createdAt: -1 })
            .lean();
    }
    async findOnePublic(id) {
        const vacancy = await this.vacancyModel
            .findOne({ _id: id, status: vacancy_status_enum_1.VacancyStatus.APPROVED })
            .populate('companyId')
            .lean();
        if (!vacancy)
            throw new common_1.NotFoundException('Vacancy not found');
        return vacancy;
    }
    async update(userId, id, dto) {
        const company = await this.getCompanyForUser(userId);
        const vacancy = await this.vacancyModel.findOneAndUpdate({ _id: id, companyId: company._id }, dto, { new: true });
        if (!vacancy)
            throw new common_1.NotFoundException('Vacancy not found');
        return vacancy;
    }
    async remove(userId, id) {
        const company = await this.getCompanyForUser(userId);
        const vacancy = await this.vacancyModel.findOneAndDelete({
            _id: id,
            companyId: company._id,
        });
        if (!vacancy)
            throw new common_1.NotFoundException('Vacancy not found');
        return { message: 'Vacancy deleted' };
    }
    async getPendingForAdmin() {
        return this.vacancyModel
            .find({ status: vacancy_status_enum_1.VacancyStatus.PENDING })
            .populate('companyId')
            .lean();
    }
    async findOneForAdmin(id) {
        const vacancy = await this.vacancyModel
            .findById(id)
            .populate('companyId')
            .lean();
        if (!vacancy)
            throw new common_1.NotFoundException('Vacancy not found');
        return vacancy;
    }
    async approve(id) {
        const vacancy = await this.vacancyModel.findByIdAndUpdate(id, { status: vacancy_status_enum_1.VacancyStatus.APPROVED }, { new: true });
        if (!vacancy)
            throw new common_1.NotFoundException('Vacancy not found');
        return vacancy;
    }
    async reject(id) {
        const vacancy = await this.vacancyModel.findByIdAndDelete(id);
        if (!vacancy)
            throw new common_1.NotFoundException('Vacancy not found');
        return { message: 'Vacancy rejected and deleted' };
    }
};
exports.VacanciesService = VacanciesService;
exports.VacanciesService = VacanciesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('vacancy')),
    __param(1, (0, mongoose_1.InjectModel)('company')),
    __param(2, (0, mongoose_1.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], VacanciesService);
//# sourceMappingURL=vacancies.service.js.map