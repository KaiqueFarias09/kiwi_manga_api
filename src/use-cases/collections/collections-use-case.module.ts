import { Module } from '@nestjs/common';
import { CollectionsUseCase } from './collections-use-case';
import { CollectionsModule } from 'src/services/collections/collections.module';

@Module({
  imports: [CollectionsModule],
  exports: [CollectionsUseCase],
  providers: [CollectionsUseCase],
})
export class CollectionsUseCaseModule {}
