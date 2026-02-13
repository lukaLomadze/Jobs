import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { companySchema } from './schema/company.schema';
import { userSchema } from '../users/schema/user.schema';
import { RolesGuard } from '../guards/roles.guard';

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
export class CompaniesModule {}

