import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);

  constructor(private emailService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string) {
    await this.emailService.sendMail({
      to,
      from: process.env.EMAIL_FROM ?? 'Jobs Board <noreply@jobsboard.com>',
      subject,
      text,
    });
  }

  async sendApplicationNotification(
    to: string,
    applicantName: string,
    vacancyTitle: string,
    siteUrl: string,
  ) {
    const html = `New application from ${applicantName} for vacancy "${vacancyTitle}". Visit ${siteUrl} to view details.`;

    await this.emailService.sendMail({
      to,
      from: process.env.EMAIL_FROM ?? 'Jobs Board <noreply@jobsboard.com>',
      subject: `New application: ${vacancyTitle}`,
      html,
    });
    this.logger.log(`Application notification email sent to ${to}`);
  }
}

