import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Cache } from 'cache-manager';
import { load } from 'cheerio';
import CombinationList from '../../common/data/combinations/combinations';
import { IMangasRepository } from '../../core/abstracts/mangas/mangas-repostitory.abstract';
import { Chapter } from '../../core/entities/chapters';
import {
  Combination,
  MangaEntity,
  MangaSimplified,
} from '../../core/entities/mangas';
import {
  ResourceDoesNotExistException,
  ResourceNotFoundException,
} from '../../core/errors';
import { MongoService } from '../mongo-prisma/mongo-prisma.service';
import { ScraperServiceService } from '../scraper/scraper-service.service';
import { MangasSearchService } from './mangas-search-service.service';

axiosRetry(axios, { retries: 3 });
@Injectable()
export class MangasServicesService implements IMangasRepository {
  constructor(
    @Inject(MongoService) private mongo: MongoService,
    @Inject(MangasSearchService)
    private mangasSearchService: MangasSearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(ScraperServiceService) private scraper: ScraperServiceService,
  ) {}
  async getOneMorePageFromCombination({
    currentPage,
    finalPage,
    combinationId,
  }: {
    currentPage: number;
    finalPage: number;
    combinationId: string;
  }): Promise<MangaSimplified[]> {
    const combinationInfo = CombinationList.combinations.find(
      (comb) => comb.id === combinationId,
    );

    const additionalPage = currentPage + 1;
    if (additionalPage === finalPage || additionalPage > finalPage) {
      throw new BadRequestException('No more pages');
    }

    const genresStringified = combinationInfo.genres.map((genre) =>
      genre.toString(),
    );
    const { mangas } = await this.mangasSearchService.multiFieldSearch(
      [...genresStringified],
      additionalPage,
    );
    return mangas;
  }
  async getCombinations(
    existingCombinationsIds?: string[],
  ): Promise<Combination[]> {
    if (existingCombinationsIds) {
      const uniqueCombinations = CombinationList.combinations.filter(
        (combination) =>
          !existingCombinationsIds.some(
            (baseInfo) => baseInfo === combination.id,
          ),
      );

      return await this.createCombinations(uniqueCombinations);
    }

    const randomCombinations = this.getRandomCombinations(
      CombinationList.combinations,
    );
    return await this.createCombinations(randomCombinations);
  }

  private async createCombinations(
    randomCombinations: Combination[],
  ): Promise<Combination[]> {
    const resultPromise = randomCombinations.map(async (combination) => {
      const cachedData = await this.cacheManager.get(
        `mangas-combination-${combination.id}`,
      );
      if (cachedData) return cachedData as Combination;

      const stringifiedGenres = combination.genres.map((genre) =>
        genre.toString(),
      );
      const searchResult = await this.mangasSearchService.multiFieldSearch([
        ...stringifiedGenres,
      ]);
      const completeCombination = {
        ...combination,
        currentPage: 1,
        mangas: this.shuffleArray(searchResult.mangas),
        finalPage: searchResult.cursor,
      };
      await this.cacheManager.set(
        `mangas-combination-${combination.id}`,
        completeCombination,
        60 * 60 * 24,
      );
      return completeCombination;
    });

    const result = await Promise.all(resultPromise);
    return result;
  }

  private getRandomCombinations(
    combinationsList: Combination[],
    numberOfCombinations = 10,
  ): Combination[] {
    const shuffledCombinations = this.shuffleArray(combinationsList);
    return shuffledCombinations.slice(0, numberOfCombinations);
  }

  private shuffleArray(array: any[]): any[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  async getMangasBySearch(keyword: string): Promise<MangaSimplified[]> {
    const mangas = await this.mangasSearchService.oneKeywordSearch(keyword);
    if (mangas.length === 0) throw new ResourceNotFoundException();

    return mangas;
  }

  async getRandomManga(): Promise<MangaEntity> {
    const count = await this.mongo.manga.count();
    const skip = Math.floor(Math.random() * count);

    const randomManga = await this.mongo.manga.findFirst({
      skip,
      where: { hasCover: true },
      include: {
        chapters: true,
      },
    });

    let missingChapters: Chapter[];
    if (randomManga.chapters.length === 0) {
      missingChapters = await this.addMissingChaptersToManga({
        mangaId: randomManga.id,
        mangaUrl: randomManga.url,
      });
      return {
        ...randomManga,
        chapters: [...missingChapters],
      };
    }

    return randomManga;
  }

  async getManga(mangaId: string): Promise<MangaEntity> {
    try {
      const manga = await this.mongo.manga.findFirst({
        where: {
          id: mangaId,
        },
        include: {
          chapters: true,
        },
      });

      let missingChapters: Chapter[];
      if (manga.chapters.length === 0) {
        missingChapters = await this.addMissingChaptersToManga({
          mangaId: manga.id,
          mangaUrl: manga.url,
        });
        return {
          ...manga,
          chapters: [...missingChapters],
        };
      }

      return manga;
    } catch (error) {
      if (error.code == 'P2023') throw new ResourceDoesNotExistException();
      throw new BadRequestException({
        message: error.message,
        statusCode: error.code,
      });
    }
  }

  private async addMissingChaptersToManga({
    mangaUrl,
    mangaId,
  }: {
    mangaUrl: string;
    mangaId: string;
  }): Promise<Chapter[]> {
    const mangaPage = await axios.get(mangaUrl);
    const scrappedPage = load(mangaPage.data);
    const scrappedMangaInfo = this.scraper.createMangaEntityFromScrappedData({
      scrappedMangaPage: scrappedPage,
      mangaPageUrl: mangaUrl,
    });

    await this.mongo.addChaptersToManga({
      chapters: scrappedMangaInfo.chapters,
      mangaId: mangaId,
    });
    return scrappedMangaInfo.chapters;
  }
}
