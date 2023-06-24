import { Module } from '@nestjs/common';
import { ICollectionsRepository } from 'src/core/abstracts';
import { CollectionsServiceService } from './collections-service.service';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';

@Module({
  providers: [
    {
      provide: ICollectionsRepository,
      useClass: CollectionsServiceService,
    },
    PostgresService,
  ],
  exports: [ICollectionsRepository],
})
export class CollectionsServiceModule {}
