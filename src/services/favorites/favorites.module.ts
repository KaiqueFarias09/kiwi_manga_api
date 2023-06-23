import { Module } from '@nestjs/common';
import { FavoritesServiceModule } from 'src/frameworks/favorites/favorites-service.module';

@Module({
  imports: [FavoritesServiceModule],
  exports: [FavoritesServiceModule],
})
export class FavoritesModule {}
