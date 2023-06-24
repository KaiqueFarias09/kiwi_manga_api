import { Module } from '@nestjs/common';
import { IFavoritesRepository } from 'src/core/abstracts';
import { FavoritesServiceService } from './favorites-service.service';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';

@Module({
  providers: [
    {
      provide: IFavoritesRepository,
      useClass: FavoritesServiceService,
    },
    PostgresService,
  ],
  exports: [IFavoritesRepository],
})
export class FavoritesServiceModule {}
