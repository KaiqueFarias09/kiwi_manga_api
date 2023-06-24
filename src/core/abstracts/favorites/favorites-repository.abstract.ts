import { CollectionManga, WasDeletedEntity } from 'src/core/entities';

export abstract class IFavoritesRepository {
  abstract getFavorites(userId: string): Promise<CollectionManga[]>;
  abstract addFavorite(
    manga: CollectionManga,
    userId: string,
  ): Promise<CollectionManga>;
  abstract removeFavorite(
    manga: CollectionManga,
    userId: string,
  ): Promise<WasDeletedEntity>;
}
