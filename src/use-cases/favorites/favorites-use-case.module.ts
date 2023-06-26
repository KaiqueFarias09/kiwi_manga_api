import { Module } from '@nestjs/common';
import { FavoritesModule } from '../../services/favorites/favorites.module';
import { FavoritesUseCase } from './favorites-use-case';

@Module({
  imports: [FavoritesModule],
  providers: [FavoritesUseCase],
  exports: [FavoritesUseCase],
})
export class FavoritesUseCaseModule {}
