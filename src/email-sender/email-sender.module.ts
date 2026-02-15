import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailSenderService } from './email-sender.service';

@Module({
  
  providers: [EmailSenderService],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}

