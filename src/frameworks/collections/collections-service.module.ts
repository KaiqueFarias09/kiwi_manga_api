import { Module } from '@nestjs/common';
import { ICollectionsRepository } from 'src/core/abstracts';
import { CollectionsServiceService } from './collections-service.service';

@Module({
  providers: [
    {
      provide: ICollectionsRepository,
      useClass: CollectionsServiceService,
    },
  ],
  exports: [ICollectionsRepository],
})
export class CollectionsServiceModule {}
