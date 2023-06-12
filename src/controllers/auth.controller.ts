import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { SigninDto, SignupDto } from '../core/dtos';
import { AuthServiceUseCases } from 'src/use-cases/auth/auth-service-use-cases';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
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
