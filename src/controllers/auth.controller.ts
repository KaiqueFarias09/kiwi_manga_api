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
import { User } from '../../prisma/prisma/postgres-client';
import { SigninDto, SignupDto } from '../core/dtos';
import { HttpResponseStatus } from '../core/enums';
import { SigninHttpResponse, SignupHttpResponse } from '../core/responses';
import { LogoutHttpResponse } from '../core/responses/auth/logout.response';
import { RefreshHttpResponse } from '../core/responses/auth/refresh.response';
import { GetUser } from '../decorators';
import { AuthServiceUseCases } from '../use-cases';

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
  async signup(@Body() signupDto: SignupDto): Promise<SignupHttpResponse> {
    const data = await this.authService.signup(signupDto);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
    };
  }

  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({ status: 200, type: SigninHttpResponse })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() signinDto: SigninDto): Promise<SigninHttpResponse> {
    const data = await this.authService.signin(signinDto);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 200, type: LogoutHttpResponse })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@GetUser() user: User): Promise<LogoutHttpResponse> {
    const result = await this.authService.logout(user.id);
    if (result)
      return {
        status: HttpResponseStatus.SUCCESS,
        message: 'User logged out successfully',
      };
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiSecurity('Authorization')
  @ApiResponse({ status: 200, type: RefreshHttpResponse })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@GetUser() data: any): Promise<RefreshHttpResponse> {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      data.payload.sub,
      data.refreshToken,
    );

    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }
}
