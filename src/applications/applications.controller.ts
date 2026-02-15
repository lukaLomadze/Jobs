import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { IsAuthGuard } from '../guards/is-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enum/role.enum';
import { UserId } from '../decorators/user-id.decorator';
import { IsValidObjectId } from '../common/dto/is-valid-object-id.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Post()
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('cv'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Apply for a vacancy',
     description: 'Submits a job application with CV upload. User only.' })
  @ApiBody({
    description: 'Application data with CV file',
    schema: {
      type: 'object',
      properties: {
        vacancyId: { type: 'string',
           description: 'ID of the vacancy to apply for' },
        cv: {
          type: 'string',
          format: 'binary',
          description: 'CV file (PDF, DOC, DOCX)',
        },
      },
      required: ['vacancyId', 'cv'],
    },
  })
  apply(
    @UserId() userId: string,
    @Body() body: CreateApplicationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.applicationsService.apply(userId, body.vacancyId, file);
  }

  @Get('my')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my applications',
    description: 'Returns all job applications submitted by the authenticated user' })
  getMyApplications(@UserId() userId: string) {
    return this.applicationsService.getUserApplications(userId);
  }

  @Get('company')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get company applications',
     description: 'Returns all applications for jobs posted by the authenticated company' })
  getCompanyApplications(@UserId() userId: string) {
    return this.applicationsService.getCompanyApplications(userId);
  }

  @Get('admin')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all applications (Admin)',
     description: 'Returns all applications. Admin only. Optionally filter by company.' })
  @ApiQuery({ name: 'companyId', required: false, 
    description: 'Filter by company ID' })
  getAllForAdmin(@Query('companyId') companyId?: string) {
    return this.applicationsService.getAllForAdmin(companyId);
  }

  @Get('vacancy/:id')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get applications for a vacancy', 
    description: 'Returns all applications for a specific vacancy. Company only (owner).' })
  @ApiParam({ name: 'id', description: 'Vacancy ID', type: String })
  getForVacancy(
    @UserId() userId: string,
    @Param() { id }: IsValidObjectId,
  ) {
    return this.applicationsService.getApplicationsForVacancy(userId, id);
  }
}

