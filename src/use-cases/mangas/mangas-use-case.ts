import { Injectable } from '@nestjs/common';
import { IMangasRepository } from '../../core/abstracts/';
import { MangaEntity, MangaSimplified } from '../../core/entities/';

@Injectable()
export class MangasUseCase {
  constructor(private readonly mangasRepository: IMangasRepository) {}
  async getManga(url: string): Promise<MangaEntity> {
    return this.mangasRepository.getManga(url);
  }
  async getRandomManga(): Promise<MangaEntity> {
    return this.mangasRepository.getRandomManga();
  }
  getMangas(keywords: string[]): Promise<MangaSimplified[]> {
    return this.mangasRepository.getMangas(keywords);
  }
}
