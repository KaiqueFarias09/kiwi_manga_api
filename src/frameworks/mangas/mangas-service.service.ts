import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AnyNode, Cheerio, CheerioAPI, load } from 'cheerio';
import { IMangasRepository } from 'src/core/abstracts/mangas/mangas-repostitory.abstract';
import { Chapter } from 'src/core/entities/chapters';
import { MangaEntity, MangaSimplified } from 'src/core/entities/mangas';
import { MongoService } from '../mongo-prisma/mongo-prisma.service';
import { Manga, Prisma } from 'prisma/prisma/mongo-client';
import axiosRetry from 'axios-retry';
import { ImageAnalyzer } from 'src/utils';
import { readJsonFileAsync } from 'src/utils/read-json-file';
import { join } from 'path';

axiosRetry(axios, { retries: 3 });
@Injectable()
export class MangasServicesService implements IMangasRepository {
  prisma: MongoService;
  imageComparer: ImageAnalyzer;
  private genres = readJsonFileAsync(join(__dirname, '../../../genres.json'));
  private logger = new Logger('MangasServicesService');

  constructor(
    @Inject(MongoService) prisma: MongoService,
    @Inject(ImageAnalyzer) imageComparer: ImageAnalyzer,
  ) {
    this.prisma = prisma;
    this.imageComparer = imageComparer;
  }

  async getMangas(keywords: string[]): Promise<MangaSimplified[]> {
    if (keywords.length === 1) {
      return await this.oneKeywordSearch(keywords[0]);
    } else {
      return await this.multiFieldSearch(keywords);
    }
  }

  async getRandomManga(): Promise<MangaEntity> {
    const count = await this.prisma.manga.count();
    const skip = Math.floor(Math.random() * count);

    const randomManga = await this.prisma.manga.findFirst({
      skip,
      where: { hasCover: true },
    });
    return {
      id: randomManga.id,
      name: randomManga.name,
      url: randomManga.url,
      cover: randomManga.cover,
      status: randomManga.status,
      updatedAt: randomManga.updatedAt,
      synopsis: randomManga.synopsis,
      genres: randomManga.genres,
      chapters: await this.prisma.chapter.findMany({
        where: { novelCoolMangaId: randomManga.id },
      }),
      hasCover: randomManga.hasCover,
      source: 'novelcool',
    };
  }

  async getManga(mangaId: string): Promise<MangaEntity> {
    try {
      const manga = await this.prisma.manga.findFirst({
        where: {
          id: mangaId,
        },
        include: {
          chapters: true,
        },
      });
      if (manga.chapters.length === 0) {
        const mangaPage = await axios.get(manga.url);
        const scrappedPage = load(mangaPage.data);
        const scrappedMangaInfo = this.createMangaEntity({
          scrappedMangaPage: scrappedPage,
          mangaPageUrl: manga.url,
        });

        this.prisma.manga.update({
          data: {
            chapters: { createMany: { data: scrappedMangaInfo.chapters } },
          },
          where: {
            id: manga.id,
            url: manga.url,
          },
        });
      }

      return manga;
    } catch (e) {
      this.logger.log(e);
    }
  }

  private async multiFieldSearch(
    keywords: string[],
  ): Promise<MangaSimplified[]> {
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

    if (keywordsCopy.length === 0)
      return this.multiFieldSearchDb(genresInKeywords);

    return this.multiFieldSearchDb([...keywordsCopy, ...genresInKeywords]);
  }

  private async oneKeywordSearch(keyword: string): Promise<MangaSimplified[]> {
    const [scrappedMangas, mangas] = await Promise.all([
      this.scrapeAdvancedSearch(keyword),
      this.searchMangaNamesDb(keyword),
    ]);

    const dbMangas: MangaSimplified[] = [];
    if (mangas.length > 0) {
      mangas.forEach((manga: Manga) => {
        dbMangas.push({
          name: manga.name,
          url: manga.url,
          cover: manga.cover,
          synopsis: manga.synopsis,
          hasCover: manga.hasCover,
        });
      });
    }

    const uniqueMangas = this.removeDuplicatesWithSynopsis([
      ...dbMangas,
      ...scrappedMangas,
    ]);
    const mangasToAdd: MangaSimplified[] = uniqueMangas.filter((manga) => {
      return manga.synopsis === '' && manga.name.includes(keyword);
    });

    const areCoverImagesValid = mangasToAdd.map((manga) =>
      this.imageComparer.isImageValid(manga.cover),
    );
    const areCoverImageValidResult = await Promise.all(areCoverImagesValid);
    if (mangasToAdd.length > 0) {
      await this.saveMangasToDb(mangasToAdd, areCoverImageValidResult);
      return await this.searchMangaNamesDb(keyword);
    }

    return await this.searchMangaNamesDb(keyword);
  }

  private async saveMangasToDb(
    mangasToAdd: MangaSimplified[],
    areValid: boolean[],
  ): Promise<void> {
    try {
      console.log(mangasToAdd);
      const mangaPages = await axios.all(
        mangasToAdd.map((manga) => {
          return axios.get(manga.url, { timeout: 30000 });
        }),
      );

      const scrappedPages = mangaPages.map((page) => load(page.data));

      const mangas: MangaEntity[] = scrappedPages.map(
        (page: CheerioAPI, i: number) => {
          return this.createMangaEntity({
            scrappedMangaPage: page,
            mangaPageUrl: mangasToAdd[i].url,
            hasCover: areValid[i],
          });
        },
      );

      const validMangas = mangas.filter((manga) => manga.chapters.length > 0);
      const promises = validMangas.map(async (manga) => {
        try {
          const result = await this.prisma.manga.create({
            data: {
              source: 'novelcool',
              cover: manga.cover,
              name: manga.name,
              url: manga.url,
              synopsis: manga.synopsis,
              hasCover: manga.hasCover,
              status: manga.status,
              updatedAt: manga.updatedAt,
              genres: manga.genres,
              chapters: {
                createMany: {
                  data: manga.chapters,
                },
              },
            },
          });
          return result;
        } catch (error) {
          console.error(error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      console.log(results.forEach((result) => console.log(result)));
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        this.logger.error(`A timeout happened on url ${err.config.url}`);
      } else {
        this.logger.error({ errorCode: err.code, errorMessage: err.message });
      }
    }
  }

  private async searchMangaNamesDb(
    searchTerm: string,
  ): Promise<MangaSimplified[]> {
    return this.prisma.manga.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        cover: true,
        url: true,
        synopsis: true,
        hasCover: true,
      },
    });
  }

  private async multiFieldSearchDb(
    searchTerms: string[],
  ): Promise<MangaSimplified[]> {
    const mangas = await this.prisma.manga.findMany({
      where: {
        hasCover: true,
        OR: [
          ...this.createMultiFieldSearchQuery(searchTerms),
          { genres: { hasSome: searchTerms } },
        ],
      },
    });

    return mangas.map((manga) => {
      return {
        name: manga.name,
        cover: manga.cover,
        url: manga.url,
        synopsis: manga.synopsis,
        id: manga.id,
        hasCover: manga.hasCover,
      };
    });
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

  private async scrapeAdvancedSearch(keyw: string): Promise<MangaSimplified[]> {
    try {
      const searchUrl =
        `https://br.novelcool.com/search/?name_sel=contain&name=${keyw}`.trim();
      const advancedSearchPage = await axios.get(searchUrl);
      const scrappedPage = load(advancedSearchPage.data);

      const data: MangaSimplified[] = [];
      scrappedPage('div.book-item').each((i, el) => {
        const manga = scrappedPage(el);
        const validationInfo = this.createValidationInfo(manga);

        if (this.isValidManga(validationInfo)) {
          data.push({
            name: manga
              .find('div:nth-child(4) > a:nth-child(1) > div:nth-child(1)')
              .text()
              .trim(),
            cover: manga
              .find('div:nth-child(1) > a:nth-child(1) > img:nth-child(1)')
              .attr('src')
              .trim(),
            url: manga
              .find('div:nth-child(1) > a:nth-child(1)')
              .attr('href')
              .trim(),
            synopsis: '',
            hasCover: false,
          });
        }
      });
      return data;
    } catch (e) {
      this.logger.log(e);
    }
  }

  private isValidManga(validateData: validateDataType) {
    if (
      !validateData.mangaName.toLowerCase().includes('novel') &&
      validateData.mangaViews > 1
    ) {
      return true;
    }
  }

  private createValidationInfo(manga: Cheerio<AnyNode>) {
    const type = manga
      .find('div:nth-child(1) > a:nth-child(1) > div:nth-child(2)')
      .text();
    const mangaName = manga
      .find('div:nth-child(4) > a:nth-child(1) > div:nth-child(1)')
      .text()
      .trim();
    const mangaViews = Number(
      manga
        .find(
          'div:nth-child(4) > a:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(2)',
        )
        .text()
        .replace(',', '.'),
    );

    const validationInfo: validateDataType = {
      type: type,
      mangaName: mangaName,
      mangaViews: mangaViews,
    };
    return validationInfo;
  }

  private createMangaEntity({
    scrappedMangaPage,
    mangaPageUrl,
    hasCover,
  }: {
    scrappedMangaPage: CheerioAPI;
    mangaPageUrl: string;
    hasCover?: boolean;
  }): MangaEntity {
    return {
      name: scrappedMangaPage('.bk-side-intro-most > h1:nth-child(1)')
        .text()
        .trim(),
      url: mangaPageUrl,
      cover: scrappedMangaPage(
        'div.bookinfo-pic:nth-child(1) > a:nth-child(1) > img:nth-child(1)',
      ).attr('src'),
      status: scrappedMangaPage('.bk-cate-type1 > a:nth-child(1)')
        .text()
        .trim(),
      updatedAt: scrappedMangaPage(
        'div.chp-item:nth-child(1) > a:nth-child(1) > div:nth-child(1) > span:nth-child(3)',
      )
        .text()
        .trim(),
      synopsis: scrappedMangaPage(
        'div.for-pc:nth-child(3) > div:nth-child(2) > div:nth-child(1)',
      )
        .text()
        .trim(),
      genres: this.getGenres(scrappedMangaPage),
      chapters: this.scrapeChapters(scrappedMangaPage),
      hasCover: hasCover,
      source: 'novelcool',
    };
  }

  private getGenres(mangaPage: CheerioAPI): string[] {
    const genres: string[] = [];
    mangaPage(
      'div.for-pc:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div',
    ).each((_, el) => {
      genres.push(mangaPage(el).text().trim());
    });

    genres.shift();
    return genres;
  }

  private scrapeChapters(mangaPage: CheerioAPI): Chapter[] {
    const chapters: Chapter[] = [];
    mangaPage('div.chp-item').each((_, el) => {
      const chapter = mangaPage(el).find('a:nth-child(1)');
      chapters.push({
        name: chapter
          .find(' div:nth-child(1) > div:nth-child(1) > span:nth-child(1)')
          .text()
          .trim(),
        url: chapter.attr('href'),
        releasedAt: chapter
          .find('div:nth-child(1) > span:nth-child(3)')
          .text()
          .trim(),
        pages: [],
      });
    });

    return chapters;
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
class validateDataType {
  type: string;
  mangaName: string;
  mangaViews: number;
}
