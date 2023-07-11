import { Body, Controller, Get, Inject, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProfilePicDto } from '../core/dtos';
import { HttpResponseStatus } from '../core/enums';
import {
  FindProfilePicHttpResponse,
  UpdateProfilePicHttpResponse,
} from '../core/responses';
import { ProfilePicUseCase } from '../use-cases/profile-pic';
import { GetUser } from '../decorators';
import { User } from '../../prisma/prisma/postgres-client';

@ApiTags('profile-pic')
@ApiSecurity('X-API-Key')
@ApiSecurity('Authorization')
@UseGuards(AuthGuard('api-key'), AuthGuard('jwt'))
@Controller('profile-pic')
export class ProfilePicController {
  profilePicService: ProfilePicUseCase;
  constructor(
    @Inject(ProfilePicUseCase) profilePicServiceUseCase: ProfilePicUseCase,
  ) {
    this.profilePicService = profilePicServiceUseCase;
  }

  @ApiResponse({ status: 200, type: FindProfilePicHttpResponse })
  @ApiOperation({ summary: "Find a user's profile picture" })
  @Get()
  async findProfilePic(
    @GetUser() user: User,
  ): Promise<FindProfilePicHttpResponse> {
    const profilePic = await this.profilePicService.findProfilePic(user.id);
    return {
      status: HttpResponseStatus.SUCCESS,
      data: {
        profilePic: profilePic,
      },
    };
  }
  @ApiOperation({ summary: "Update a user's profile picture" })
  @ApiResponse({ status: 200, type: UpdateProfilePicHttpResponse })
  @Put()
  async updateProfilePic(
    @GetUser() user: User,
    @Body() { profilePic }: UpdateProfilePicDto,
  ): Promise<UpdateProfilePicHttpResponse> {
    const updatedProfilePic = await this.profilePicService.updateProfilePic({
      profilePic,
      userId: user.id,
    });

    return {
      status: HttpResponseStatus.SUCCESS,
      data: { profilePic: updatedProfilePic },
    };
  }
}
