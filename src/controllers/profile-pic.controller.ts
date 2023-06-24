import { Body, Controller, Get, Inject, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProfilePicDto } from 'src/core/dtos';
import { ProfilePicUseCase } from 'src/use-cases/profile-pic';

@ApiTags('profile-pic')
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
