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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const sign_up_user_dto_1 = require("./dto/sign-up-user.dto");
const sign_up_company_dto_1 = require("./dto/sign-up-company.dto");
const sign_in_dto_1 = require("./dto/sign-in.dto");
const is_auth_guard_1 = require("../guards/is-auth.guard");
const google_guard_1 = require("../guards/google.guard");
const user_id_decorator_1 = require("../decorators/user-id.decorator");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    signUpUser(dto) {
        return this.authService.signUpUser(dto);
    }
    signUpCompany(dto) {
        return this.authService.signUpCompany(dto);
    }
    signIn(dto) {
        return this.authService.signIn(dto);
    }
    signInWithGoogle() {
    }
    async googleAuthCallback(req, res) {
        const { token, redirectUrl } = await this.authService.signInWithGoogle(req.user);
        res.cookie('token', token, { maxAge: 60 * 60 * 24 * 7 * 1000 });
        res.redirect(redirectUrl);
    }
    currentUser(userId) {
        return this.authService.getCurrentUser(userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('sign-up/user'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user',
        description: 'Creates a new user account with job seeker role' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'User registered successfully', type: sign_up_user_dto_1.SignUpUserDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'User already exists or validation failed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_up_user_dto_1.SignUpUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signUpUser", null);
__decorate([
    (0, common_1.Post)('sign-up/company'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new company', description: 'Creates a new company account. Company requires admin approval before becoming active.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Company registered, awaiting approval', type: sign_up_company_dto_1.SignUpCompanyDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Email already registered or validation failed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_up_company_dto_1.SignUpCompanyDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signUpCompany", null);
__decorate([
    (0, common_1.Post)('sign-in'),
    (0, swagger_1.ApiOperation)({ summary: 'User login',
        description: 'Authenticates user and returns JWT token with role information' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Returns token and role', type: sign_in_dto_1.SignInDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_in_dto_1.SignInDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth login',
        description: 'Initiates Google OAuth 2.0 authentication flow' }),
    (0, common_1.UseGuards)(google_guard_1.GoogleOauthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signInWithGoogle", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth callback',
        description: 'Handles OAuth callback from Google and returns authentication token' }),
    (0, common_1.UseGuards)(google_guard_1.GoogleOauthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
__decorate([
    (0, common_1.Get)('current-user'),
    (0, common_1.UseGuards)(is_auth_guard_1.IsAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user info',
        description: 'Returns the current authenticated user information' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Current user info' }),
    __param(0, (0, user_id_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "currentUser", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map