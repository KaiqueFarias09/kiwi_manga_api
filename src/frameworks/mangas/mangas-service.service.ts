import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { load } from 'cheerio';
import { IMangasRepository } from '../../core/abstracts/mangas/mangas-repostitory.abstract';
import { Chapter } from '../../core/entities/chapters';
import { MangaEntity, MangaSimplified } from '../../core/entities/mangas';
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
  mongo: MongoService;
  imageComparer: ImageAnalyzer;
  mangasSearchService: MangasSearchService;
  scraper: ScraperServiceService;

  constructor(
    @Inject(MongoService) mongoService: MongoService,
    @Inject(ImageAnalyzer) imageComparer: ImageAnalyzer,
    @Inject(MangasSearchService) mangasSearchService: MangasSearchService,
    @Inject(ScraperServiceService) scraper: ScraperServiceService,
  ) {
    this.mongo = mongoService;
    this.imageComparer = imageComparer;
    this.mangasSearchService = mangasSearchService;
    this.scraper = scraper;
  }

  async getMangas(keywords: string[]): Promise<MangaSimplified[]> {
    if (keywords.length === 1) {
      const mangas = await this.mangasSearchService.oneKeywordSearch(
        keywords[0],
      );
      if (mangas.length === 0) throw new ResourceNotFoundException();

      return mangas;
    } else {
      const mangas = await this.mangasSearchService.multiFieldSearch(keywords);
      if (mangas.length === 0) throw new ResourceNotFoundException();

      return mangas;
    }
  }

  async getRandomManga(): Promise<MangaEntity> {
    const validMangas = await this.mongo.manga.findMany({
      where: { hasCover: true, chapters: { some: {} } },
      include: { chapters: true },
    });

    const randomMangaIndex = Math.floor(Math.random() * validMangas.length);
    return validMangas[randomMangaIndex];
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
