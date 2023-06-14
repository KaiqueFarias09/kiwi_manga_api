import { Injectable } from '@nestjs/common';
import { IMangasRepository } from 'src/core/abstracts/mangas/mangas-repostitory.abstract';
import { Manga, MangaSimplified, MangaList } from 'src/core/entities/mangas';

@Injectable()
export class MangasUseCase {
  constructor(private readonly mangasRepository: IMangasRepository) {}
  getManga(url: string): Manga {
    return this.getManga(url);
  }
  getRandomManga(): Promise<Manga> {
    return this.mangasRepository.getRandomManga();
  }
  getMangas(filter?: string): Promise<MangaSimplified[]> {
    return this.mangasRepository.getMangas(filter);
  }
  searchForMangas(keyword: string): Promise<MangaSimplified[]> {
    return this.mangasRepository.searchForMangas(keyword);
  }
}
