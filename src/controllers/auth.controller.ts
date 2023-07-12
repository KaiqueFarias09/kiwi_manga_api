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
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SigninDto, SignupDto } from '../core/dtos';
import { HttpResponseStatus } from '../core/enums';
import { SigninHttpResponse, SignupHttpResponse } from '../core/responses';
import { AuthServiceUseCases } from '../use-cases';
import { GetUser } from '../decorators';
import { User } from '../../prisma/prisma/postgres-client';

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

  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    type: SignupHttpResponse,
  })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const data = await this.authService.signup(signupDto);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
      },
    };
  }

  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({ status: 200, type: SigninHttpResponse })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    const data = await this.authService.signin(signinDto);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        accessToken: data.accessToken,
      },
    };
  }

  @Post('logout')
  async logout(@GetUser() user: User) {
    return await this.authService.logout(user.id);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@GetUser() data: any) {
    console.log(data);
    return await this.authService.refreshTokens(
      data.payload.sub,
      data.refreshToken,
    );
  }
}
