import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { vacancySchema } from './schema/vacancy.schema';
import { companySchema } from '../companies/schema/company.schema';
import { userSchema } from '../users/schema/user.schema';
import { RolesGuard } from '../guards/roles.guard';

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
export class VacanciesModule {}

