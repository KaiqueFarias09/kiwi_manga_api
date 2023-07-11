import {
  Body,
  Controller,
  Delete,
  Get,
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
import { GetUser } from '../decorators';
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
import { UsersUseCase } from '../use-cases/users';
import { User } from '../../prisma/prisma/postgres-client';

@ApiTags('user')
@ApiSecurity('X-API-Key')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'), AuthGuard('jwt'))
@Controller('user')
export class UsersController {
  userService: UsersUseCase;
  constructor(@Inject(UsersUseCase) userService: UsersUseCase) {
    this.userService = userService;
  }
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
  @Delete('userId')
  async deleteAccount(
    @GetUser() user: User,
    @Body() deleteAccountDto: DeleteAccountDto,
  ): Promise<DeleteAccountHttpResponse> {
    await this.userService.deleteAccount(user.id);
    return {
      message: 'Account deleted successfully',
      status: HttpResponseStatus.SUCCESS,
    };
  }
}
