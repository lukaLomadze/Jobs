import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { IsAuthGuard } from '../guards/is-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserId } from '../decorators/user-id.decorator';
import { Role } from '../enum/role.enum';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { IsValidObjectId } from '../common/dto/is-valid-object-id.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

class PaginationQuery {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1)
  page = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Max(100)
  take = 30;
}

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Get('me')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current company profile', 
    description: 'Returns the company profile for the authenticated company user' })
  getMyCompany(@UserId() userId: string) {
    return this.companiesService.findByUserId(userId);
  }

  @Patch(':id')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update company profile',
     description: 'Updates the company profile for the authenticated company' })
  @ApiParam({ name: 'id', description: 'Company ID', type: String })
  update(
    @UserId() userId: string,
    @Param() { id }: IsValidObjectId,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(userId, id, dto);
  }

  @Get()
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all companies (Admin)',
     description: 'Returns all companies with pagination. Admin only.' })
  @ApiQuery({ name: 'page', required: false,
     description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'take', required: false,
     description: 'Number of items per page (default: 30, max: 100)' })
  findAll(@Query() query: PaginationQuery) {
    return this.companiesService.findAll(query.page, query.take);
  }

  @Get('pending')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending companies (Admin)', 
    description: 'Returns all companies awaiting approval. Admin only.' })
  getPending() {
    return this.companiesService.getPendingCompanies();
  }

  @Patch(':id/approve')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve company (Admin)', 
    description: 'Approves a pending company. Admin only.' })
  @ApiParam({ name: 'id', description: 'Company ID', type: String })
  approve(@Param() { id }: IsValidObjectId) {
    return this.companiesService.approve(id);
  }

  @Patch(':id/ban')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ban company (Admin)', 
    description: 'Bans a company. Admin only.' })
  @ApiParam({ name: 'id', description: 'Company ID', type: String })
  ban(@Param() { id }: IsValidObjectId) {
    return this.companiesService.ban(id);
  }
}
