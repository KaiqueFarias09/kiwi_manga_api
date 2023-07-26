import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import * as argon from 'argon2';
import { User } from '../../prisma/prisma/postgres-client';
import {
  DeleteAccountDto,
  UpdateEmailDto,
  UpdateNicknameDto,
  UpdatePasswordDto,
} from '../core/dtos';
import { HttpResponseStatus } from '../core/enums';
import {
  DeleteAccountHttpResponse,
  UpdateEmailHttpResponse,
  UpdateNicknameHttpResponse,
  UpdatePasswordHttpResponse,
} from '../core/responses';
import { GetUser } from '../decorators';
import { PostgresService } from '../frameworks/postgres-prisma/postgres-prisma.service';
import { UsersUseCase } from '../use-cases/users';

@ApiTags('user')
@ApiSecurity('X-API-Key')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'), AuthGuard('jwt'))
@Controller('user')
export class UsersController {
  constructor(
    @Inject(UsersUseCase) private readonly userService: UsersUseCase,
    @Inject(PostgresService) private readonly postgresService: PostgresService,
  ) {}
  @ApiOperation({ summary: "Get the current authenticated user's details" })
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiOperation({ summary: "Update the current authenticated user's password" })
  @ApiResponse({ status: 200, type: UpdatePasswordHttpResponse })
  @Patch('password')
  async updatePassword(
    @GetUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdatePasswordHttpResponse> {
    await this.verifyPassword(updatePasswordDto.password, user.id);
    const data = await this.userService.updatePassword({
      newPassword: updatePasswordDto.newPassword,
      userId: user.id,
    });
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        user: {
          id: data.userId,
          nickname: data.nickname,
        },
      },
    };
  }
  @ApiOperation({ summary: "Update the current authenticated user's nickname" })
  @ApiResponse({ status: 200, type: UpdateNicknameHttpResponse })
  @Patch('nickname')
  async updateNickname(
    @GetUser() user: User,
    @Body() updateNicknameDto: UpdateNicknameDto,
  ): Promise<UpdateNicknameHttpResponse> {
    await this.verifyPassword(updateNicknameDto.password, user.id);
    const data = await this.userService.updateNickname({
      newNickname: updateNicknameDto.newNickname,
      userId: user.id,
    });

    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        user: {
          id: data.userId,
          newNickname: data.newNickname,
        },
      },
    };
  }
  @ApiOperation({ summary: "Update the current authenticated user's email" })
  @ApiResponse({ status: 200, type: UpdateEmailHttpResponse })
  @Patch('email')
  async updateEmail(
    @GetUser() user: User,
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<UpdateEmailHttpResponse> {
    await this.verifyPassword(updateEmailDto.password, user.id);
    const data = await this.userService.updateEmail({
      newEmail: updateEmailDto.newEmail,
      userId: user.id,
    });
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        user: {
          id: data.userId,
          newEmail: data.newEmail,
        },
      },
    };
  }
  @ApiOperation({ summary: "Delete the current authenticated user's account" })
  @ApiResponse({ status: 200, type: DeleteAccountHttpResponse })
  @Delete()
  async deleteAccount(
    @GetUser() user: User,
    @Body() deleteAccountDto: DeleteAccountDto,
  ): Promise<DeleteAccountHttpResponse> {
    await this.verifyPassword(deleteAccountDto.password, user.id);
    await this.userService.deleteAccount(user.id);
    return {
      message: 'Account deleted successfully',
      status: HttpResponseStatus.SUCCESS,
    };
  }

  private async verifyPassword(password: string, userId: string) {
    const user = await this.postgresService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const match = await argon.verify(user.password, password);
    if (!match) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }
}
