import { MangaEntity, MangaSimplified } from 'src/core/entities/mangas';

export abstract class IMangasRepository {
  abstract getManga(url: string): Promise<MangaEntity>;
  abstract getRandomManga(): Promise<MangaEntity>;
  abstract getMangas(keywords: string[]): Promise<MangaSimplified[]>;
}
