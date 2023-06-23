import { Injectable } from '@nestjs/common';
import { IFavoritesRepository } from 'src/core/abstracts';
import { MangaSimplified } from 'src/core/entities';

@Injectable()
export class FavoritesServiceService implements IFavoritesRepository {
  getFavorites(userId: string): Promise<MangaSimplified[]> {
    throw new Error('Method not implemented.');
  }
  addFavorite(
    manga: MangaSimplified,
    userId: string,
  ): Promise<MangaSimplified> {
    throw new Error('Method not implemented.');
  }
  removeFavorite(
    manga: MangaSimplified,
    userId: string,
  ): Promise<MangaSimplified> {
    throw new Error('Method not implemented.');
  }
}
