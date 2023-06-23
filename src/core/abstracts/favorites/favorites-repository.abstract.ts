import { MangaSimplified } from 'src/core/entities';

export abstract class IFavoritesRepository {
  abstract getFavorites(userId: string): Promise<MangaSimplified[]>;
  abstract addFavorite(
    manga: MangaSimplified,
    userId: string,
  ): Promise<MangaSimplified>;
  abstract removeFavorite(
    manga: MangaSimplified,
    userId: string,
  ): Promise<MangaSimplified>;
}
