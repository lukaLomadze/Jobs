import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { companySchema } from './schema/company.schema';
import { userSchema } from '../users/schema/user.schema';
import { RolesGuard } from '../guards/roles.guard';
import { CompanyOwnershipMiddleware } from '../middlewares/company-ownership.middleware';
import { AdminOnlyMiddleware } from '../middlewares/admin-only.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'company', schema: companySchema },
      { name: 'user', schema: userSchema },
    ]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, RolesGuard],
  exports: [CompaniesService],
})
export class CompaniesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CompanyOwnershipMiddleware)
      .forRoutes({
        path: 'companies/:id',
        method: RequestMethod.PATCH,
      });
    consumer
      .apply(AdminOnlyMiddleware)
      .forRoutes(
        { path: 'companies', method: RequestMethod.GET },
        { path: 'companies/pending', method: RequestMethod.GET },
        { path: 'companies/:id/approve', method: RequestMethod.PATCH },
        { path: 'companies/:id/ban', method: RequestMethod.PATCH },
      );
  }
}

