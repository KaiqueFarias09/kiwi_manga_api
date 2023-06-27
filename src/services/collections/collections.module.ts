import { Module } from '@nestjs/common';
import { CollectionsServiceModule } from '../../frameworks/collections/collections-service.module';

@Module({
  imports: [CollectionsServiceModule],
  exports: [CollectionsServiceModule],
})
export class CollectionsModule {}
