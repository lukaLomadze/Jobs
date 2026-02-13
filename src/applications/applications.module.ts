import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { UserOnlyMiddleware } from '../middlewares/user-only.middleware';
import { CompanyRoleMiddleware } from '../middlewares/company-role.middleware';

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
export class ApplicationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserOnlyMiddleware).forRoutes(
      { path: 'applications', method: RequestMethod.POST },
      { path: 'applications/my', method: RequestMethod.GET },
    );
    consumer.apply(CompanyRoleMiddleware).forRoutes(
      { path: 'applications/company', method: RequestMethod.GET },
      { path: 'applications/vacancy/:id', method: RequestMethod.GET },
    );
  }
}

