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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const role_enum_1 = require("../enum/role.enum");
let AuthService = class AuthService {
    userModel;
    companyModel;
    jwtService;
    constructor(userModel, companyModel, jwtService) {
        this.userModel = userModel;
        this.companyModel = companyModel;
        this.jwtService = jwtService;
    }
    async signUpUser(dto) {
        const existUser = await this.userModel.findOne({ email: dto.email });
        if (existUser)
            throw new common_1.BadRequestException('User already exists');
        const hashedPassword = await bcrypt_1.default.hash(dto.password, 10);
        await this.userModel.create({
            fullName: dto.fullName,
            email: dto.email,
            password: hashedPassword,
            role: role_enum_1.Role.USER,
        });
        return { message: 'User registered successfully' };
    }
    async signUpCompany(dto) {
        const existUser = await this.userModel.findOne({ email: dto.email });
        if (existUser)
            throw new common_1.BadRequestException('Email already registered');
        const hashedPassword = await bcrypt_1.default.hash(dto.password, 10);
        const user = await this.userModel.create({
            fullName: dto.fullName,
            email: dto.email,
            password: hashedPassword,
            role: role_enum_1.Role.COMPANY,
        });
        await this.companyModel.create({
            name: dto.companyName,
            description: dto.description,
            email: dto.email,
            phone: dto.phone,
            website: dto.website,
            userId: user._id,
            isApproved: false,
        });
        const company = await this.companyModel.findOne({ userId: user._id });
        await this.userModel.findByIdAndUpdate(user._id, {
            companyId: company._id,
        });
        return { message: 'Company registered. Awaiting admin approval.' };
    }
    async signIn(dto) {
        const user = await this.userModel
            .findOne({ email: dto.email })
            .select('+password');
        if (!user)
            throw new common_1.BadRequestException('Invalid credentials');
        const isPassEqual = await bcrypt_1.default.compare(dto.password, user.password);
        if (!isPassEqual)
            throw new common_1.BadRequestException('Invalid credentials');
        const payload = { userId: user._id.toString(), role: user.role };
        const token = this.jwtService.sign(payload, { expiresIn: '7d' });
        return { token, role: user.role };
    }
    async getCurrentUser(userId) {
        const user = await this.userModel
            .findById(userId)
            .populate('companyId')
            .lean();
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const { password, ...rest } = user;
        return rest;
    }
    async signInWithGoogle(googleUser) {
        let user = await this.userModel.findOne({ email: googleUser.email });
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-20) + Date.now().toString();
            const hashedPassword = await bcrypt_1.default.hash(randomPassword, 10);
            user = await this.userModel.create({
                fullName: googleUser.fullName,
                email: googleUser.email,
                password: hashedPassword,
                role: role_enum_1.Role.USER,
            });
        }
        const payload = { userId: user._id.toString(), role: user.role };
        const token = this.jwtService.sign(payload, { expiresIn: '7d' });
        const redirectUrl = process.env.FRONT_URL ?? 'http://localhost:3000';
        return { token, redirectUrl };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('user')),
    __param(1, (0, mongoose_1.InjectModel)('company')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map