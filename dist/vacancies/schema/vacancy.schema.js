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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vacancySchema = exports.Vacancy = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const vacancy_status_enum_1 = require("../../enum/vacancy-status.enum");
let Vacancy = class Vacancy {
    title;
    description;
    category;
    location;
    salaryMin;
    salaryMax;
    companyId;
    status;
};
exports.Vacancy = Vacancy;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Vacancy.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Vacancy.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Vacancy.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Vacancy.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Vacancy.prototype, "salaryMin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Vacancy.prototype, "salaryMax", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Types.ObjectId,
        ref: 'company',
        required: true,
    }),
    __metadata("design:type", mongoose_2.default.Types.ObjectId)
], Vacancy.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: vacancy_status_enum_1.VacancyStatus, default: vacancy_status_enum_1.VacancyStatus.PENDING }),
    __metadata("design:type", String)
], Vacancy.prototype, "status", void 0);
exports.Vacancy = Vacancy = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Vacancy);
exports.vacancySchema = mongoose_1.SchemaFactory.createForClass(Vacancy);
//# sourceMappingURL=vacancy.schema.js.map