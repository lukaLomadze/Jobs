import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignUpCompanyDto } from './dto/sign-up-company.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IsAuthGuard } from '../guards/is-auth.guard';
import { UserId } from '../decorators/user-id.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up/user')
  @ApiCreatedResponse({ description: 'User registered' })
  @ApiBadRequestResponse({ description: 'User already exists' })
  signUpUser(@Body() dto: SignUpUserDto) {
    return this.authService.signUpUser(dto);
  }

  @Post('sign-up/company')
  @ApiCreatedResponse({ description: 'Company registered, awaiting approval' })
  @ApiBadRequestResponse({ description: 'Email already registered' })
  signUpCompany(@Body() dto: SignUpCompanyDto) {
    return this.authService.signUpCompany(dto);
  }

  @Post('sign-in')
  @ApiOkResponse({ description: 'Returns token and role' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Get('current-user')
  @UseGuards(IsAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Current user info' })
  currentUser(@UserId() userId: string) {
    return this.authService.getCurrentUser(userId);
  }
}
