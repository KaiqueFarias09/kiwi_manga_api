import { Module } from '@nestjs/common';
import { IFavoritesRepository } from 'src/core/abstracts';
import { FavoritesServiceService } from './favorites-service.service';

@Module({
  providers: [
    {
      provide: IFavoritesRepository,
      useClass: FavoritesServiceService,
    },
  ],
  exports: [IFavoritesRepository],
})
export class FavoritesServiceModule {}
