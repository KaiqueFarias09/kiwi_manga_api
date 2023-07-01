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
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateProfilePicDto } from '../core/dtos';
import { HttpResponseStatus } from '../core/enums';
import {
  FindProfilePicHttpResponse,
  UpdateProfilePicHttpResponse,
} from '../core/responses';
import { ProfilePicUseCase } from '../use-cases/profile-pic';

@ApiTags('profile-pic')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'))
@Controller(':userId/profile-pic')
export class ProfilePicController {
  profilePicService: ProfilePicUseCase;
  constructor(
    @Inject(ProfilePicUseCase) profilePicServiceUseCase: ProfilePicUseCase,
  ) {
    this.profilePicService = profilePicServiceUseCase;
  }

  @ApiResponse({ status: 200, type: FindProfilePicHttpResponse })
  @Get()
  async findProfilePic(
    @Param('userId') userId: string,
  ): Promise<FindProfilePicHttpResponse> {
    const profilePic = await this.profilePicService.findProfilePic(userId);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        profilePic: profilePic,
      },
    };
  }

  @ApiResponse({ status: 200, type: UpdateProfilePicHttpResponse })
  @Put()
  async updateProfilePic(
    @Param('userId') userId: string,
    @Body() { profilePic }: UpdateProfilePicDto,
  ): Promise<UpdateProfilePicHttpResponse> {
    const updatedProfilePic = await this.profilePicService.updateProfilePic({
      profilePic,
      userId: userId,
    });

    return {
      status: HttpResponseStatus.SUCCESS,
      data: { profilePic: updatedProfilePic },
    };
  }
}
