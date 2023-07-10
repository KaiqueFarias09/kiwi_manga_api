import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
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

@ApiTags('users')
@ApiSecurity('X-API-Key')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'), AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  userService: UsersUseCase;
  constructor(@Inject(UsersUseCase) userService: UsersUseCase) {
    this.userService = userService;
  }

  @Get('me')
  getMe(@GetUser() user: any) {
    return user;
  }

  @ApiResponse({ status: 200, type: UpdatePasswordHttpResponse })
  @Patch(':userId/password')
  async updatePassword(
    @Param('userId') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdatePasswordHttpResponse> {
    const data = await this.userService.updatePassword({
      newPassword: updatePasswordDto.newPassword,
      userId,
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

  @ApiResponse({ status: 200, type: UpdateNicknameHttpResponse })
  @Patch(':userId/nickname')
  async updateNickname(
    @Param('userId') userId: string,
    @Body() updateNicknameDto: UpdateNicknameDto,
  ): Promise<UpdateNicknameHttpResponse> {
    const data = await this.userService.updateNickname({
      newNickname: updateNicknameDto.newNickname,
      userId,
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

  @ApiResponse({ status: 200, type: UpdateEmailHttpResponse })
  @Patch(':userId/email')
  async updateEmail(
    @Param('userId') userId: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ): Promise<UpdateEmailHttpResponse> {
    const data = await this.userService.updateEmail({
      newEmail: updateEmailDto.newEmail,
      userId,
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

  @ApiResponse({ status: 200, type: DeleteAccountHttpResponse })
  @Delete(':userId')
  async deleteAccount(
    @Param('userId') userId: string,
    @Body() deleteAccountDto: DeleteAccountDto,
  ): Promise<DeleteAccountHttpResponse> {
    await this.userService.deleteAccount(userId);
    return {
      message: 'Account deleted successfully',
      status: HttpResponseStatus.SUCCESS,
    };
  }
}
