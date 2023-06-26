import { Module } from '@nestjs/common';
import { ICollectionsRepository } from '../../core/abstracts';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';
import { CollectionsServiceService } from './collections-service.service';

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
