import { Injectable } from '@nestjs/common';
import { IFavoritesRepository } from 'src/core/abstracts';
import { CollectionManga, WasDeletedEntity } from 'src/core/entities';

@Injectable()
export class FavoritesUseCase {
  constructor(private readonly favoritesRepository: IFavoritesRepository) {}

  getFavorites(userId: string): Promise<CollectionManga[]> {
    return this.favoritesRepository.getFavorites(userId);
  }
  addFavorite(
    manga: CollectionManga,
    userId: string,
  ): Promise<CollectionManga> {
    return this.favoritesRepository.addFavorite(manga, userId);
  }
  removeFavorite(
    manga: CollectionManga,
    userId: string,
  ): Promise<WasDeletedEntity> {
    return this.favoritesRepository.removeFavorite(manga, userId);
  }
}
