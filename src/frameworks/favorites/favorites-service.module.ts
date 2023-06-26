import { Module } from '@nestjs/common';
import { IFavoritesRepository } from '../../core/abstracts';
import { PostgresService } from '../postgres-prisma/postgres-prisma.service';
import { FavoritesServiceService } from './favorites-service.service';

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
