import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AnyNode, Cheerio, CheerioAPI, load } from 'cheerio';
import { IMangasRepository } from 'src/core/abstracts/mangas/mangas-repostitory.abstract';
import { Chapter } from 'src/core/entities/chapters';
import { Manga, MangaSimplified } from 'src/core/entities/mangas';
import { PrismaService } from '../prisma/prisma.service';
import { NovelCoolManga, Prisma } from '@prisma/client';
import axiosRetry from 'axios-retry';
import { ImageAnalyzer } from 'src/utils';
import { readJsonFileAsync } from 'src/utils/read-json-file';
import { join } from 'path';

axiosRetry(axios, { retries: 3 });
@Injectable()
export class MangasServicesService implements IMangasRepository {
  prisma: PrismaService;
  imageComparer: ImageAnalyzer;
  constructor(
    @Inject(PrismaService) prisma: PrismaService,
    @Inject(ImageAnalyzer) imageComparer: ImageAnalyzer,
  ) {
    this.prisma = prisma;
    this.imageComparer = imageComparer;
  }

  private genres = readJsonFileAsync(
    join(__dirname, '../../../../genres.json'),
  );
  private logger = new Logger('MangasServicesService');

  async getMangas(keywords: string[]): Promise<MangaSimplified[]> {
    if (keywords.length === 1) {
      const keyword = keywords[0];

      const scrappedMangas = await this.scrapeAdvancedSearch(keyword);
      const scrappedMangaNames = scrappedMangas.map((manga) => manga.name);

      const mangas = await this.searchMangaNamesDb([
        keyword,
        ...scrappedMangaNames,
      ]);
      const dbMangas: MangaSimplified[] = [];
      if (mangas.length > 0) {
        mangas.forEach((manga: NovelCoolManga) => {
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
        const scrappedMangas = await this.saveMangasToDb(
          mangasToAdd,
          areCoverImageValidResult,
        );
        const allMangas = this.removeDuplicatesWithSynopsis([
          ...dbMangas,
          ...scrappedMangas,
        ]);
        return allMangas.map(({ ...manga }: MangaSimplified) => {
          return { ...manga, url: manga.url.trim() };
        });
      }

      return dbMangas.map(({ ...manga }: MangaSimplified) => {
        return { ...manga, url: manga.url.trim() };
      });
    } else {
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
  }

  private async saveMangasToDb(
    mangasToAdd: MangaSimplified[],
    areValid: boolean[],
  ): Promise<MangaSimplified[]> {
    try {
      const mangaPages = await axios.all(
        mangasToAdd.map((manga) => {
          return axios.get(manga.url, { timeout: 30000 });
        }),
      );

      const scrappedPages = mangaPages.map((page) => load(page.data));

      const mangas: Manga[] = scrappedPages.map(
        (page: CheerioAPI, i: number) => {
          return this.createMangaEntity({
            scrappedMangaPage: page,
            mangaPageUrl: mangasToAdd[i].url,
            hasCover: areValid[i],
          });
        },
      );

      const validMangas = mangas.filter((manga) => manga.chapters.length > 0);
      await this.prisma.novelCoolManga.createMany({
        data: [...validMangas],
      });
      return validMangas.map((manga) => {
        return {
          cover: manga.cover,
          name: manga.name,
          synopsis: manga.synopsis,
          url: manga.url,
          hasCover: manga.hasCover,
        };
      });
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        this.logger.error(`A timeout happened on url ${err.config.url}`);
      } else {
        this.logger.error({ errorCode: err.code, errorMessage: err.message });
      }
    }
  }
  private async searchMangaNamesDb(
    searchTerms: string[],
  ): Promise<MangaSimplified[]> {
    return this.prisma.novelCoolManga.findMany({
      where: {
        name: {
          in: searchTerms,
          mode: 'insensitive',
        },
      },
      select: {
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
    const mangas = await this.prisma.novelCoolManga.findMany({
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
  ): Prisma.NovelCoolMangaWhereInput[] {
    const nameSearchParams = searchTerms.map(
      (term): Prisma.NovelCoolMangaWhereInput => {
        return {
          name: {
            contains: term,
            mode: 'insensitive',
          },
        };
      },
    );

    const synopsisSearchParams = searchTerms.map(
      (term): Prisma.NovelCoolMangaWhereInput => {
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

  async getRandomManga(): Promise<Manga> {
    const count = await this.prisma.novelCoolManga.count();
    const skip = Math.floor(Math.random() * count);

    const randomManga = await this.prisma.novelCoolManga.findFirst({
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
      chapters: randomManga.chapters,
      hasCover: randomManga.hasCover,
    };
  }

  async getManga(mangaId: string): Promise<Manga> {
    try {
      const manga = await this.prisma.novelCoolManga.findFirst({
        where: {
          id: mangaId,
        },
      });
      return manga;
    } catch (e) {
      this.logger.log(e);
    }
  }

  private createMangaEntity({
    scrappedMangaPage,
    mangaPageUrl,
    hasCover,
  }: {
    scrappedMangaPage: CheerioAPI;
    mangaPageUrl: string;
    hasCover?: boolean;
  }): Manga {
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
      chapters: this.getChapters(scrappedMangaPage),
      hasCover: hasCover,
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

  private getChapters(mangaPage: CheerioAPI): Chapter[] {
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
