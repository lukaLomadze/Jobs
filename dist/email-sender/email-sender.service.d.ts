import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailSenderService {
    private emailService;
    private readonly logger;
    constructor(emailService: MailerService);
    sendEmail(to: string, subject: string, text: string): Promise<void>;
    sendApplicationNotification(to: string, applicantName: string, vacancyTitle: string, siteUrl: string): Promise<void>;
}
