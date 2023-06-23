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
  async findProfilePic(@Param('id') userID: string): Promise<string> {
    return await this.profilePicService.findProfilePic(userID);
  }

  @Put(':id')
  updateProfilePic(
    @Param('id') userID: string,
    @Body() { profilePic }: UpdateProfilePicDto,
  ): Promise<{ profilePic: string; userId: string }> {
    return this.profilePicService.updateProfilePic({
      profilePic: profilePic,
      userId: userID,
    });
  }
}
