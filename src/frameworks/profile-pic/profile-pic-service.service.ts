import { Inject, Injectable } from '@nestjs/common';
import { IProfilePicRepository } from 'src/core/abstracts';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';
import { UpdateProfilePicEntity } from 'src/core/entities';

@Injectable()
export class ProfilePicServiceService implements IProfilePicRepository {
  postgresService: PostgresService;
  constructor(@Inject(PostgresService) postgresService: PostgresService) {
    this.postgresService = postgresService;
  }

  async findProfilePic(userId: string): Promise<string> {
    const user = await this.postgresService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        profilePicture: true,
      },
    });
    console.log(user);
    return user.profilePicture;
  }

  async updateProfilePicDto({
    userId,
    profilePic,
  }: UpdateProfilePicEntity): Promise<string> {
    const data = await this.postgresService.user.update({
      where: {
        id: userId,
      },
      data: {
        profilePicture: profilePic,
      },
    });

    return data.profilePicture;
  }
}
