import { Injectable } from '@nestjs/common';
import { IProfilePicRepository } from 'src/core/abstracts';
import { UpdateProfilePicEntity } from 'src/core/entities';

@Injectable()
export class ProfilePicUseCase {
  constructor(private readonly profilePicRepository: IProfilePicRepository) {}
  findProfilePic(userId: string): Promise<string> {
    return this.profilePicRepository.findProfilePic(userId);
  }

  async updateProfilePic(
    updateProfilePicEntity: UpdateProfilePicEntity,
  ): Promise<{
    profilePic: string;
    userId: string;
  }> {
    return this.profilePicRepository.updateProfilePicDto(
      updateProfilePicEntity,
    );
  }
}
