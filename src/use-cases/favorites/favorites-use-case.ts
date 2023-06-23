import { Injectable } from '@nestjs/common';
import { IFavoritesRepository } from 'src/core/abstracts';
import { MangaSimplified } from 'src/core/entities';

@Injectable()
export class FavoritesUseCase {
  constructor(private readonly favoritesRepository: IFavoritesRepository) {}

  getFavorites(userId: string): Promise<MangaSimplified[]> {
    return this.favoritesRepository.getFavorites(userId);
  }
  addFavorite(
    manga: MangaSimplified,
    userId: string,
  ): Promise<MangaSimplified> {
    return this.favoritesRepository.addFavorite(manga, userId);
  }
  removeFavorite(
    manga: MangaSimplified,
    userId: string,
  ): Promise<MangaSimplified> {
    return this.favoritesRepository.removeFavorite(manga, userId);
  }
}
