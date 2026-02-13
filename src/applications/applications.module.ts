import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { applicationSchema } from './schema/application.schema';
import { vacancySchema } from '../vacancies/schema/vacancy.schema';
import { companySchema } from '../companies/schema/company.schema';
import { userSchema } from '../users/schema/user.schema';
import { AwsS3Module } from '../aws-s3/aws-s3.module';
import { EmailSenderModule } from '../email-sender/email-sender.module';
import { RolesGuard } from '../guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'application', schema: applicationSchema },
      { name: 'vacancy', schema: vacancySchema },
      { name: 'company', schema: companySchema },
      { name: 'user', schema: userSchema },
    ]),
    AwsS3Module,
    EmailSenderModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, RolesGuard],
})
export class ApplicationsModule {}

