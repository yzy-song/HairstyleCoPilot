import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators/api-common-responses.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // This signup route is for initial testing.
  // In production, we will remove it or protect it.
  @Post('signup')
  @ApiOperation({ summary: 'Register a new stylist' })
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the profile of the logged-in user.' })
  @ApiCommonResponses()
  getProfile(@Request() req) {
    // req.user is populated by the JwtStrategy's validate method
    return req.user;
  }
}
