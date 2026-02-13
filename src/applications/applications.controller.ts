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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('cv'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        vacancyId: { type: 'string' },
        cv: {
          type: 'string',
          format: 'binary',
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
  getMyApplications(@UserId() userId: string) {
    return this.applicationsService.getUserApplications(userId);
  }

  @Get('company')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  getCompanyApplications(@UserId() userId: string) {
    return this.applicationsService.getCompanyApplications(userId);
  }

  @Get('admin')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiQuery({ name: 'companyId', required: false })
  getAllForAdmin(@Query('companyId') companyId?: string) {
    return this.applicationsService.getAllForAdmin(companyId);
  }

  @Get('vacancy/:id')
  @UseGuards(IsAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @ApiBearerAuth()
  getForVacancy(
    @UserId() userId: string,
    @Param() { id }: IsValidObjectId,
  ) {
    return this.applicationsService.getApplicationsForVacancy(userId, id);
  }
}

