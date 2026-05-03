import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignUpSalonDto } from './dto/signup-salon.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators/api-common-responses.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/salon')
  @ApiOperation({ summary: 'Register a new salon (business account)' })
  @ApiResponse({ status: 201, description: 'Salon created, returns JWT token.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  @ApiCommonResponses()
  signUpSalon(@Body() signUpSalonDto: SignUpSalonDto) {
    return this.authService.signUpSalon(signUpSalonDto);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new stylist (requires existing salon)' })
  @ApiResponse({ status: 201, description: 'The stylist has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  @ApiCommonResponses()
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login as a stylist or salon' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT token.' })
  @ApiCommonResponses()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiResponse({ status: 200, description: 'If the email exists, a reset link will be sent.' })
  @ApiCommonResponses()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using a token' })
  @ApiResponse({ status: 200, description: 'Password has been reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  @ApiCommonResponses()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the profile of the logged-in user.' })
  @ApiCommonResponses()
  getProfile(@Request() req) {
    return req.user;
  }
}
