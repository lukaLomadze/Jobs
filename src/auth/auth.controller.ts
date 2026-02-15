import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignUpCompanyDto } from './dto/sign-up-company.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IsAuthGuard } from '../guards/is-auth.guard';
import { GoogleOauthGuard } from '../guards/google.guard';
import { UserId } from '../decorators/user-id.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-up/user')
  @ApiOperation({ summary: 'Register a new user', 
    description: 'Creates a new user account with job seeker role' })
  @ApiCreatedResponse({ description: 'User registered successfully', type: SignUpUserDto })
  @ApiBadRequestResponse({ description: 'User already exists or validation failed' })
  signUpUser(@Body() dto: SignUpUserDto) {
    return this.authService.signUpUser(dto);
  }

  @Post('sign-up/company')
  @ApiOperation({ summary: 'Register a new company', description: 'Creates a new company account. Company requires admin approval before becoming active.' })
  @ApiCreatedResponse({ description: 'Company registered, awaiting approval', type: SignUpCompanyDto })
  @ApiBadRequestResponse({ description: 'Email already registered or validation failed' })
  signUpCompany(@Body() dto: SignUpCompanyDto) {
    return this.authService.signUpCompany(dto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'User login',
     description: 'Authenticates user and returns JWT token with role information' })
  @ApiOkResponse({ description: 'Returns token and role', type: SignInDto })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Get('google')
  @ApiOperation({ summary: 'Google OAuth login',
     description: 'Initiates Google OAuth 2.0 authentication flow' })
  @UseGuards(GoogleOauthGuard)
  signInWithGoogle() {
    
    
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback',
     description: 'Handles OAuth callback from Google and returns authentication token' })
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: any) {
    const { token, redirectUrl } =
      await this.authService.signInWithGoogle(req.user);

    res.cookie('token', token, { maxAge: 60 * 60 * 24 * 7 * 1000 }); // 7 days
    res.redirect(redirectUrl);
  }

  @Get('current-user')
  @UseGuards(IsAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info', 
    description: 'Returns the current authenticated user information' })
  @ApiOkResponse({ description: 'Current user info' })
  currentUser(@UserId() userId: string) {
    return this.authService.getCurrentUser(userId);
  }
}
