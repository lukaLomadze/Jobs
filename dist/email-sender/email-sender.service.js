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
var EmailSenderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSenderService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
let EmailSenderService = EmailSenderService_1 = class EmailSenderService {
    emailService;
    logger = new common_1.Logger(EmailSenderService_1.name);
    constructor(emailService) {
        this.emailService = emailService;
    }
    async sendEmail(to, subject, text) {
        await this.emailService.sendMail({
            to,
            from: process.env.EMAIL_USER ?? 'Jobs Board <noreply@jobsboard.com>',
            subject,
            text,
        });
    }
    async sendApplicationNotification(to, applicantName, vacancyTitle, siteUrl) {
        const html = `New application from ${applicantName} for vacancy "${vacancyTitle}". Visit ${siteUrl} to view details.`;
        await this.emailService.sendMail({
            to,
            from: process.env.EMAIL_USER ?? 'Jobs Board <noreply@jobsboard.com>',
            subject: `New application: ${vacancyTitle}`,
            html,
        });
        this.logger.log(`Application notification email sent to ${to}`);
    }
};
exports.EmailSenderService = EmailSenderService;
exports.EmailSenderService = EmailSenderService = EmailSenderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], EmailSenderService);
//# sourceMappingURL=email-sender.service.js.map