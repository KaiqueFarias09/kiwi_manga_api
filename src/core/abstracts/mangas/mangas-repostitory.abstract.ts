import { Manga, MangaList, MangaSimplified } from 'src/core/entities/mangas';

export abstract class IMangasRepository {
  abstract getManga(url: string): Promise<Manga>;
  abstract getRandomManga(): Promise<Manga>;
  abstract getMangas(filter?: string): Promise<MangaSimplified[]>;
  abstract searchForMangas(keyword: string): Promise<MangaSimplified[]>;
}
