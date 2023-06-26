import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  DeleteAccountDto,
  UpdateEmailDto,
  UpdateNicknameDto,
  UpdatePasswordDto,
} from 'src/core/dtos';
import { UsersUseCase } from 'src/use-cases/users';

@ApiTags('users')
@ApiSecurity('Authorization')
@Controller('users/:userId')
export class UsersController {
  userService: UsersUseCase;
  constructor(userService: UsersUseCase) {
    this.userService = userService;
  }

  @Patch('password')
  updatePassword(
    @Param('userId') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword({
      newPassword: updatePasswordDto.newPassword,
      userId,
    });
  }

  @Patch('nickname')
  updateNickname(
    @Param('userId') userId: string,
    @Body() updateNicknameDto: UpdateNicknameDto,
  ) {
    return this.userService.updateNickname({
      newNickname: updateNicknameDto.newNickname,
      userId,
    });
  }

  @Patch('email')
  updateEmail(
    @Param('userId') userId: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.userService.updateEmail({
      newEmail: updateEmailDto.newEmail,
      userId,
    });
  }

  @Delete()
  deleteAccount(
    @Param('userId') userId: string,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    return this.userService.deleteAccount(userId);
  }
}
