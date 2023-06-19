import { Manga, MangaSimplified } from 'src/core/entities/mangas';

export abstract class IMangasRepository {
  abstract getManga(url: string): Promise<Manga>;
  abstract getRandomManga(): Promise<Manga>;
  abstract getMangas(keywords: string[]): Promise<MangaSimplified[]>;
}
