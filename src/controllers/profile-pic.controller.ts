import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ProfilePicUseCase } from '../use-cases/profile-pic';
import { UpdateProfilePicDto } from '../core/dtos';

@ApiTags('profile-pic')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'))
@Controller('profile-pic')
export class ProfilePicController {
  profilePicService: ProfilePicUseCase;
  constructor(
    @Inject(ProfilePicUseCase) profilePicServiceUseCase: ProfilePicUseCase,
  ) {
    this.profilePicService = profilePicServiceUseCase;
  }

  @Get(':id')
  async findProfilePic(@Param('id') userID: string) {
    const profilePic = await this.profilePicService.findProfilePic(userID);
    return { profilePic: profilePic };
  }

  @Put(':id')
  async updateProfilePic(
    @Param('id') userID: string,
    @Body() { profilePic }: UpdateProfilePicDto,
  ) {
    const updatedProfilePic = await this.profilePicService.updateProfilePic({
      profilePic,
      userId: userID,
    });

    return {
      profilePic: updatedProfilePic,
    };
  }
}
