import { Injectable } from '@nestjs/common';
import { IProfilePicRepository } from 'src/core/abstracts';

@Injectable()
export class ProfilePicUseCase {
  constructor(private readonly profilePicRepository: IProfilePicRepository) {}
  findProfilePic(userId: string): Promise<string> {
    return this.profilePicRepository.findProfilePic(userId);
  }
  saveProfilePic(userId: string): Promise<string> {
    return this.profilePicRepository.saveProfilePic(userId);
  }
}
