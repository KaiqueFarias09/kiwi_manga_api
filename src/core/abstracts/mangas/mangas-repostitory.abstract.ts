import {
  Combination,
  CombinationBaseInfo,
  MangaEntity,
  MangaSimplified,
} from '../../entities/mangas';

export abstract class IMangasRepository {
  abstract getManga(url: string): Promise<MangaEntity>;
  abstract getRandomManga(): Promise<MangaEntity>;
  abstract getMangasBySearch(keyword: string): Promise<MangaSimplified[]>;
  abstract getCombinations(
    existingCombinations?: CombinationBaseInfo[],
  ): Promise<Combination[]>;
  abstract getOneMorePageFromCombination(
    combination: CombinationBaseInfo,
  ): Promise<MangaSimplified[]>;
}
