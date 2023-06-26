import { CollectionManga, WasDeletedEntity } from '../../entities';

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
