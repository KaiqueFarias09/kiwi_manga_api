import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthServiceUseCases } from 'src/use-cases/auth/auth-service-use-cases';
import { SigninDto, SignupDto } from '../core/dtos';

@ApiTags('auth')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'))
@Controller('auth')
export class AuthController {
  authService: AuthServiceUseCases;
  constructor(
    @Inject(AuthServiceUseCases) authServiceUseCases: AuthServiceUseCases,
  ) {
    this.authService = authServiceUseCases;
  }

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }
}
