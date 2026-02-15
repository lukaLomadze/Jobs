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
  ApiOperation,
  ApiParam,
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
  constructor(private readonly vacanciesService: VacanciesService) { }

  // Admin endpoints
  @Get('admin/pending')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending vacancies (Admin)', description: 'Returns all vacancies awaiting approval. Admin only.' })
  getPendingForAdmin() {
    return this.vacanciesService.getPendingForAdmin();
  }

  @Patch('admin/:id/approve')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve vacancy (Admin)', description: 'Approves a pending vacancy. Admin only.' })
  @ApiParam({ name: 'id', description: 'Vacancy ID', type: String })
  approve(@Param() { id }: IsValidObjectId) {
    return this.vacanciesService.approve(id);
  }

  @Patch('admin/:id/reject')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject vacancy (Admin)', description: 'Rejects a pending vacancy. Admin only.' })
  @ApiParam({ name: 'id', description: 'Vacancy ID', type: String })
  reject(@Param() { id }: IsValidObjectId) {
    return this.vacanciesService.reject(id);
  }

  @Get('admin/:id')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vacancy by ID (Admin)', description: 'Returns a single vacancy by ID. Admin only.' })
  @ApiParam({ name: 'id', description: 'Vacancy ID', type: String })
  getOneForAdmin(@Param() { id }: IsValidObjectId) {
    return this.vacanciesService.findOneForAdmin(id);
  }

  // Company
  @Get('my')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my vacancies', description: 'Returns all vacancies created by the authenticated company' })
  getMyVacancies(@UserId() userId: string) {
    return this.vacanciesService.findMyVacancies(userId);
  }

  @Post()
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create vacancy', description: 'Creates a new vacancy. Company only. Requires approval.' })
  create(@UserId() userId: string, @Body() dto: CreateVacancyDto) {
    return this.vacanciesService.create(userId, dto);
  }

  @Patch(':id')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vacancy', description: 'Updates an existing vacancy. Company only (owner).' })
  @ApiParam({ name: 'id', description: 'Vacancy ID', type: String })
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
  @ApiOperation({ summary: 'Delete vacancy', description: 'Deletes a vacancy. Company only (owner).' })
  @ApiParam({ name: 'id', description: 'Vacancy ID', type: String })
  remove(@UserId() userId: string, @Param() { id }: IsValidObjectId) {
    return this.vacanciesService.remove(userId, id);
  }

  // Public 
  @Get()
  @ApiOperation({ summary: 'Get public vacancies', description: 'Returns a public list of approved vacancies with optional filters' })
  @ApiQuery({ name: 'search', required: false, description: 'Search in title and description' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'location', required: false, description: 'Filter by location' })
  @ApiQuery({ name: 'salaryMin', required: false, description: 'Minimum salary' })
  @ApiQuery({ name: 'salaryMax', required: false, description: 'Maximum salary' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'take', required: false, description: 'Number of items per page (default: 30)' })
  findPublic(@Query() query: VacancyFilterQuery) {
    return this.vacanciesService.findPublic(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single vacancy', description: 'Returns a single approved vacancy by ID' })
  @ApiParam({ name: 'id', description: 'Vacancy ID', type: String })
  findOne(@Param() { id }: IsValidObjectId) {
    return this.vacanciesService.findOnePublic(id);
  }
}

