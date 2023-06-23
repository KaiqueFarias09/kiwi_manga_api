import { Module } from '@nestjs/common';
import { IProfilePicRepository } from 'src/core/abstracts';
import { ProfilePicServiceService } from './profile-pic-service.service';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';

@Module({
  providers: [
    { provide: IProfilePicRepository, useClass: ProfilePicServiceService },
    PostgresService,
  ],
  exports: [IProfilePicRepository],
})
export class ProfilePicServiceModule {}
