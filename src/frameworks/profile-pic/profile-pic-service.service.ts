import { Injectable } from '@nestjs/common';
import { IProfilePicRepository } from 'src/core/abstracts';

@Injectable()
export class ProfilePicServiceService implements IProfilePicRepository {
  findProfilePic(userId: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  saveProfilePic(userId: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
