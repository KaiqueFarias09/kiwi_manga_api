import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IProfilePicRepository } from '../../core/abstracts';
import { UpdateProfilePicEntity } from '../../core/entities';
import { ResourceDoesNotExistException } from '../../core/errors';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';

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
    if (!user) throw new ResourceDoesNotExistException();

    return user.profilePicture;
  }

  async updateProfilePicDto({
    userId,
    profilePic,
  }: UpdateProfilePicEntity): Promise<string> {
    try {
      const data = await this.postgresService.user.update({
        where: {
          id: userId,
        },
        data: {
          profilePicture: profilePic,
        },
      });

      return data.profilePicture;
    } catch (error) {
      if (error.code === 'P2025') throw new ResourceDoesNotExistException();
      throw new BadRequestException({
        message: 'Error updating profile picture',
        statusCode: 404,
      });
    }
  }
}
