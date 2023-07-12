import {
  Combination,
  MangaEntity,
  MangaSimplified,
} from '../../entities/mangas';

export abstract class IMangasRepository {
  abstract getManga(url: string): Promise<MangaEntity>;
  abstract getRandomManga(): Promise<MangaEntity>;
  abstract getMangasBySearch(keyword: string): Promise<MangaSimplified[]>;
  abstract getCombinations(
    existingCombinationsIds?: string[],
  ): Promise<Combination[]>;
  abstract getOneMorePageFromCombination({
    cursor,
    combinationId,
  }: {
    cursor?: number;
    combinationId: string;
  }): Promise<MangaSimplified[]>;
}
