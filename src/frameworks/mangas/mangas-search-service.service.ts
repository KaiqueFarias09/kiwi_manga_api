import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';
import { join } from 'path';
import { Prisma } from 'prisma/prisma/mongo-client';
import { MangaSimplified } from '../../core/entities';
import { MangaEntity } from '../../core/entities/mangas';
import { ImageAnalyzer } from '../../utils';
import { readJsonFileAsync } from '../../utils/read-json-file';
import { MongoService } from '../mongo-prisma/mongo-prisma.service';
import { ScraperServiceService } from '../scraper/scraper-service.service';

@Injectable()
export class MangasSearchService {
  private genres = readJsonFileAsync(join(__dirname, '../../../genres.json'));
  private logger = new Logger('MangasSearchService');
  mongo: MongoService;
  scraper: ScraperServiceService;
  imageAnalyzer: ImageAnalyzer;

  constructor(
    @Inject(MongoService) mongoService: MongoService,
    @Inject(ScraperServiceService) scraperService: ScraperServiceService,
    @Inject(ImageAnalyzer) imageAnalyzerService: ImageAnalyzer,
  ) {
    this.mongo = mongoService;
    this.scraper = scraperService;
    this.imageAnalyzer = imageAnalyzerService;
  }

  async multiFieldSearch(
    keywords: string[],
    pageNumber = 1,
  ): Promise<{ mangas: MangaSimplified[]; cursor?: string }> {
    const genresInKeywords = [];
    const keywordsCopy = [...keywords];

    for (const keyword of keywordsCopy) {
      if (!isNaN(Number(keyword))) {
        genresInKeywords.push(this.genres[Number(keyword) - 1].name);
        keywords = keywords.filter(
          (word) => word !== this.genres[Number(keyword) - 1],
        );
      }
    }

    if (keywordsCopy.length === 0) {
      const { mangas, cursor } = await this.mongo.multiFieldMangaSearch(
        this.createMultiFieldSearchQuery(genresInKeywords),
        genresInKeywords,
      );

      return {
        mangas,
        cursor,
      };
    }

    const searchTerms = [...keywordsCopy, ...genresInKeywords];
    const { mangas, cursor } = await this.mongo.multiFieldMangaSearch(
      this.createMultiFieldSearchQuery(searchTerms),
      searchTerms,
    );
    return { mangas, cursor };
  }

  private createMultiFieldSearchQuery(
    searchTerms: string[],
  ): Prisma.MangaWhereInput[] {
    const nameSearchParams = searchTerms.map((term): Prisma.MangaWhereInput => {
      return {
        name: {
          contains: term,
          mode: 'insensitive',
        },
      };
    });

    const synopsisSearchParams = searchTerms.map(
      (term): Prisma.MangaWhereInput => {
        return {
          synopsis: {
            contains: term,
            mode: 'insensitive',
          },
        };
      },
    );

    return [...nameSearchParams, ...synopsisSearchParams];
  }

  async oneKeywordSearch(keyword: string): Promise<MangaSimplified[]> {
    const [scrappedMangas, dbMangas] = await Promise.all([
      this.scraper.scrapeAdvancedSearch(keyword),
      this.mongo.oneKeywordSearch(keyword),
    ]);

    const mangasMissingInDb = this.removeDuplicatesWithSynopsis([
      ...dbMangas,
      ...scrappedMangas,
    ]).filter((manga) => {
      return manga.synopsis === '' && manga.name.includes(keyword);
    });

    const mangasCoverValidationPromises = mangasMissingInDb.map((manga) =>
      this.imageAnalyzer.isImageValid(manga.cover),
    );
    const mangasCoverValidationResults = await Promise.all(
      mangasCoverValidationPromises,
    );

    if (mangasMissingInDb.length > 0) {
      await this.saveMissingMangasInDb(
        mangasMissingInDb,
        mangasCoverValidationResults,
      );
      return await this.mongo.oneKeywordSearch(keyword);
    }

    return await this.mongo.oneKeywordSearch(keyword);
  }

  private async saveMissingMangasInDb(
    mangasToAdd: MangaSimplified[],
    areValid: boolean[],
  ): Promise<void> {
    try {
      const mangaPages = await axios.all(
        mangasToAdd.map((manga) => {
          return axios.get(manga.url, { timeout: 30000 });
        }),
      );

      const scrappedPages = mangaPages.map((page) => load(page.data));
      const mangas: MangaEntity[] = scrappedPages.map(
        (page: CheerioAPI, i: number) => {
          return this.scraper.createMangaEntityFromScrappedData({
            scrappedMangaPage: page,
            mangaPageUrl: mangasToAdd[i].url,
            hasCover: areValid[i],
          });
        },
      );

      const validMangas = mangas.filter((manga) => manga.chapters.length > 0);
      const promises = validMangas.map(async (manga) => {
        try {
          const result = await this.mongo.createManga(manga);
          return result;
        } catch (error) {
          console.error(error);
          return null;
        }
      });

      await Promise.all(promises);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        this.logger.error(`A timeout happened on url ${err.config.url}`);
      } else {
        this.logger.error({ errorCode: err.code, errorMessage: err.message });
      }
    }
  }

  private removeDuplicatesWithSynopsis(
    mangas: MangaSimplified[],
  ): MangaSimplified[] {
    const map = new Map();
    for (const manga of mangas) {
      const value = manga.url.trim();
      const synopsis = manga.synopsis;
      if (!value) {
        continue;
      }
      if (map.has(value)) {
        const existing = map.get(value);
        if (existing.synopsis) {
          continue;
        }
        if (synopsis) {
          map.set(value, manga);
        }
      } else {
        map.set(value, manga);
      }
    }
    return Array.from(map.values());
  }
}
