import { Module } from '@nestjs/common';
import { IProfilePicRepository } from 'src/core/abstracts';
import { ProfilePicServiceService } from './profile-pic-service.service';

@Module({
  providers: [
    { provide: IProfilePicRepository, useClass: ProfilePicServiceService },
  ],
  exports: [IProfilePicRepository],
})
export class ProfilePicServiceModule {}
