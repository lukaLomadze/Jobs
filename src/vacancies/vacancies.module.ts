import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { vacancySchema } from './schema/vacancy.schema';
import { companySchema } from '../companies/schema/company.schema';
import { userSchema } from '../users/schema/user.schema';
import { RolesGuard } from '../guards/roles.guard';
import { CompanyApprovedMiddleware } from '../middlewares/company-approved.middleware';
import { VacancyOwnershipMiddleware } from '../middlewares/vacancy-ownership.middleware';
import { AdminOnlyMiddleware } from '../middlewares/admin-only.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'vacancy', schema: vacancySchema },
      { name: 'company', schema: companySchema },
      { name: 'user', schema: userSchema },
    ]),
  ],
  controllers: [VacanciesController],
  providers: [VacanciesService, RolesGuard],
  exports: [VacanciesService],
})
export class VacanciesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CompanyApprovedMiddleware)
      .forRoutes(
        { path: 'vacancies', method: RequestMethod.POST },
        { path: 'vacancies/my', method: RequestMethod.GET },
      );
    consumer
      .apply(VacancyOwnershipMiddleware)
      .forRoutes(
        { path: 'vacancies/:id', method: RequestMethod.PATCH },
        { path: 'vacancies/:id', method: RequestMethod.DELETE },
      );
    consumer
      .apply(AdminOnlyMiddleware)
      .forRoutes(
        { path: 'vacancies/admin/pending', method: RequestMethod.GET },
        { path: 'vacancies/admin/:id', method: RequestMethod.GET },
        { path: 'vacancies/admin/:id/approve', method: RequestMethod.PATCH },
        { path: 'vacancies/admin/:id/reject', method: RequestMethod.PATCH },
      );
  }
}

