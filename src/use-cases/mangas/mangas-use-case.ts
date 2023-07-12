import { Injectable } from '@nestjs/common';
import { IMangasRepository } from '../../core/abstracts/';
import {
  Combination,
  MangaEntity,
  MangaSimplified,
} from '../../core/entities/';

@Injectable()
export class MangasUseCase {
  constructor(private readonly mangasRepository: IMangasRepository) {}
  getOneMorePageFromCombination({
    combinationId,
    cursor,
  }: {
    combinationId: string;
    cursor?: number;
  }): Promise<MangaSimplified[]> {
    return this.mangasRepository.getOneMorePageFromCombination({
      combinationId,
      cursor,
    });
  }
  getCombinations(existingCombinationsIds?: string[]): Promise<Combination[]> {
    return this.mangasRepository.getCombinations(existingCombinationsIds);
  }

  async getManga(url: string): Promise<MangaEntity> {
    return this.mangasRepository.getManga(url);
  }
  async getRandomManga(): Promise<MangaEntity> {
    return this.mangasRepository.getRandomManga();
  }
  getMangasBySearch(keyword: string): Promise<MangaSimplified[]> {
    return this.mangasRepository.getMangasBySearch(keyword);
  }
}
