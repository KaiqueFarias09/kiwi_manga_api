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
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SigninDto, SignupDto } from '../core/dtos';
import { HttpResponseStatus } from '../core/enums';
import { SigninHttpResponse, SignupHttpResponse } from '../core/responses';
import { AuthServiceUseCases } from '../use-cases/auth/auth-service-use-cases';

@ApiTags('auth')
@ApiSecurity('X-API-Key')
@UseGuards(AuthGuard('api-key'))
@Controller('auth')
export class AuthController {
  authService: AuthServiceUseCases;
  constructor(
    @Inject(AuthServiceUseCases) authServiceUseCases: AuthServiceUseCases,
  ) {
    this.authService = authServiceUseCases;
  }

  @ApiResponse({
    status: 201,
    type: SignupHttpResponse,
  })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<SignupHttpResponse> {
    const data = await this.authService.signup(signupDto);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        access_token: data.accessToken,
      },
    };
  }

  @ApiResponse({ status: 200, type: SigninHttpResponse })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() signinDto: SigninDto): Promise<SigninHttpResponse> {
    const data = await this.authService.signin(signinDto);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        accessToken: data.accessToken,
      },
    };
  }
}
