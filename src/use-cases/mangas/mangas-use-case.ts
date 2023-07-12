import { Injectable } from '@nestjs/common';
import { IMangasRepository } from '../../core/abstracts/';
import {
  Combination,
  CombinationBaseInfo,
  MangaEntity,
  MangaSimplified,
} from '../../core/entities/';

@Injectable()
export class MangasUseCase {
  constructor(private readonly mangasRepository: IMangasRepository) {}
  getCombinations(
    existingCombinations?: CombinationBaseInfo[],
  ): Promise<Combination[]> {
    return this.mangasRepository.getCombinations(existingCombinations);
  }
  getOneMorePageFromCombination(
    combination: CombinationBaseInfo,
  ): Promise<MangaSimplified[]> {
    return this.mangasRepository.getOneMorePageFromCombination(combination);
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
