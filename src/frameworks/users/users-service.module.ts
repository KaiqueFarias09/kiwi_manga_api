import { Module } from '@nestjs/common';
import { IUsersRepositoryAbstract } from 'src/core/abstracts';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';
import { UsersServiceService } from './users-service.service';

@Module({
  providers: [
    { provide: IUsersRepositoryAbstract, useClass: UsersServiceService },
    PostgresService,
  ],
  exports: [IUsersRepositoryAbstract],
})
export class UsersServiceModule {}
