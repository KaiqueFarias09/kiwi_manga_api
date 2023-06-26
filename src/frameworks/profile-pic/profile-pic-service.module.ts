import { Module } from '@nestjs/common';
import { IProfilePicRepository } from '../../core/abstracts';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';
import { ProfilePicServiceService } from './profile-pic-service.service';

@Module({
  providers: [
    { provide: IProfilePicRepository, useClass: ProfilePicServiceService },
    PostgresService,
  ],
  exports: [IProfilePicRepository],
})
export class ProfilePicServiceModule {}
