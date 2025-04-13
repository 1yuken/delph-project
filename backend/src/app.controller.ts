import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiBearerAuth, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './auth/dto/login.dto';

@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: LoginDto,
    examples: {
      default: {
        value: {
          username: 'John Doe',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Profile data',
    schema: {
      example: {
        userId: 1,
        username: 'John Doe',
        isFreelancer: true,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
