import { Injectable } from '@nestjs/common';
import { IMangasRepository } from 'src/core/abstracts/mangas/mangas-repostitory.abstract';
import { Manga, MangaSimplified, MangaList } from 'src/core/entities/mangas';

@Injectable()
export class MangasUseCase {
  constructor(private readonly mangasRepository: IMangasRepository) {}
  getManga(url: string): Manga {
    return this.getManga(url);
  }
  getRandomManga(): Manga {
    return this.getRandomManga();
  }
  getMangas(filter?: string): MangaSimplified {
    return this.getMangas(filter);
  }
  searchForMangas(keyword: string): MangaList[] {
    return this.searchForMangas(keyword);
  }
}
