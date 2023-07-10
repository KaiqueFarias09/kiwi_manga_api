import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { load } from 'cheerio';
import CombinationList from 'resources/combinations/combinations';
import { IMangasRepository } from '../../core/abstracts/mangas/mangas-repostitory.abstract';
import { Chapter } from '../../core/entities/chapters';
import {
  Combination,
  CombinationBaseInfo,
  MangaEntity,
  MangaSimplified,
} from '../../core/entities/mangas';
import {
  ResourceDoesNotExistException,
  ResourceNotFoundException,
} from '../../core/errors';
import { ImageAnalyzer } from '../../utils';
import { MongoService } from '../mongo-prisma/mongo-prisma.service';
import { ScraperServiceService } from '../scraper/scraper-service.service';
import { MangasSearchService } from './mangas-search-service.service';

axiosRetry(axios, { retries: 3 });
@Injectable()
export class MangasServicesService implements IMangasRepository {
  constructor(
    @Inject(MongoService) private mongo: MongoService,
    @Inject(ImageAnalyzer) private imageComparer: ImageAnalyzer,
    @Inject(MangasSearchService)
    private mangasSearchService: MangasSearchService,
    @Inject(ScraperServiceService) private scraper: ScraperServiceService,
  ) {}

  async getCombinations(
    existingCombinations?: CombinationBaseInfo[],
  ): Promise<Combination[]> {
    if (existingCombinations) {
      const newCombinations = CombinationList.combinations.filter(
        (combination) =>
          !existingCombinations.some(
            (baseInfo) => baseInfo.id === combination.id,
          ),
      );

      const searchResults: Promise<Combination>[] = newCombinations.map(
        async (combination) => {
          const searchResult = await this.mangasSearchService.multiFieldSearch([
            combination.genres[0].toString(),
            combination.genres[1].toString(),
          ]);

          return {
            ...combination,
            currentPage: 1,
            finalPage: searchResult.numberOfPages,
            mangas: searchResult.mangas,
          };
        },
      );
      return await Promise.all(searchResults);
    }

    const randomCombinations = this.getRandomCombinations(
      CombinationList.combinations,
    );
    const combinations: Promise<Combination>[] = randomCombinations.map(
      async (combination) => {
        const searchResult = await this.mangasSearchService.multiFieldSearch([
          combination.genres[0].toString(),
          combination.genres[1].toString(),
        ]);

        return {
          ...combination,
          currentPage: 1,
          finalPage: searchResult.numberOfPages,
          mangas: searchResult.mangas,
        };
      },
    );
    return await Promise.all(combinations);
  }

  private getRandomCombinations(
    combinationsList: Combination[],
    numberOfCombinations = 10,
  ): Combination[] {
    const shuffled = [...combinationsList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, numberOfCombinations);
  }

  async getOneMorePageFromCombination(
    combination: CombinationBaseInfo,
  ): Promise<MangaSimplified[]> {
    const additionalPage = combination.page + 1;

    if (additionalPage === combination.maxPages) {
      throw new BadRequestException('No more pages');
    }

    const { mangas } = await this.mangasSearchService.multiFieldSearch(
      [combination.genres[0].toString(), combination.genres[1].toString()],
      additionalPage,
    );
    return mangas;
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
