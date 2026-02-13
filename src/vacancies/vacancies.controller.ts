import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { IsAuthGuard } from '../guards/is-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enum/role.enum';
import { UserId } from '../decorators/user-id.decorator';
import { IsValidObjectId } from '../common/dto/is-valid-object-id.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

class VacancyFilterQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1)
  page = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  take = 30;
}

@ApiTags('vacancies')
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  // Admin endpoints
  @Get('admin/pending')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  getPendingForAdmin() {
    return this.vacanciesService.getPendingForAdmin();
  }

  @Patch('admin/:id/approve')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  approve(@Param() { id }: IsValidObjectId) {
    return this.vacanciesService.approve(id);
  }

  @Patch('admin/:id/reject')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  reject(@Param() { id }: IsValidObjectId) {
    return this.vacanciesService.reject(id);
  }

  // Company-specific
  @Get('my')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  getMyVacancies(@UserId() userId: string) {
    return this.vacanciesService.findMyVacancies(userId);
  }

  @Post()
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  create(@UserId() userId: string, @Body() dto: CreateVacancyDto) {
    return this.vacanciesService.create(userId, dto);
  }

  @Patch(':id')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  update(
    @UserId() userId: string,
    @Param() { id }: IsValidObjectId,
    @Body() dto: UpdateVacancyDto,
  ) {
    return this.vacanciesService.update(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  remove(@UserId() userId: string, @Param() { id }: IsValidObjectId) {
    return this.vacanciesService.remove(userId, id);
  }

  // Public endpoints
  @Get()
  @ApiOkResponse({ description: 'Public list of approved vacancies' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'salaryMin', required: false })
  @ApiQuery({ name: 'salaryMax', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'take', required: false })
  findPublic(@Query() query: VacancyFilterQuery) {
    return this.vacanciesService.findPublic(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Single approved vacancy' })
  findOne(@Param() { id }: IsValidObjectId) {
    return this.vacanciesService.findOnePublic(id);
  }
}

