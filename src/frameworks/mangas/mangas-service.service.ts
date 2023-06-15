import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AnyNode, Cheerio, CheerioAPI, load } from 'cheerio';
import { IMangasRepository } from 'src/core/abstracts/mangas/mangas-repostitory.abstract';
import { Chapter } from 'src/core/entities/chapters';
import { Manga, MangaSimplified } from 'src/core/entities/mangas';
import { PrismaService } from '../prisma/prisma.service';
import { NovelCoolManga } from '@prisma/client';
import axiosRetry from 'axios-retry';
import { v4 as uuid } from 'uuid';

axiosRetry(axios, { retries: 3 }); // This will automatically retry failed requests up to 3 times
@Injectable()
export class MangasServicesService implements IMangasRepository {
  prisma: PrismaService;
  constructor(@Inject(PrismaService) prisma: PrismaService) {
    this.prisma = prisma;
  }
  private logger = new Logger('MangasServicesService');

  getMangas(filter?: string): Promise<MangaSimplified[]> {
    throw new Error('Method not implemented.');
  }

  async searchForMangas(keyword: string): Promise<MangaSimplified[]> {
    const [mangas, scrappedMangas] = await Promise.all([
      this.searchMangaInDb(keyword),
      this.scrapeAdvancedSearch(keyword),
    ]);

    const dbMangas: MangaSimplified[] = [];
    if (mangas.length > 0) {
      mangas.forEach((manga: NovelCoolManga) => {
        dbMangas.push({
          name: manga.name,
          url: manga.url,
          cover: manga.cover,
          synopsis: manga.synopsis,
        });
      });
    }

    const uniqueMangas = this.removeDuplicatesWithSynopsis([
      ...dbMangas,
      ...scrappedMangas,
    ]);
    const mangasToAdd: MangaSimplified[] = uniqueMangas.filter((manga) => {
      return manga.synopsis === '';
    });
    this.logger.log(dbMangas);
    this.logger.log(
      mangasToAdd.forEach((manga) =>
        this.logger.log(manga.name, manga.url, manga.synopsis),
      ),
    );
    this.logger.log(mangasToAdd);
    await this.saveMangasToDb(mangasToAdd);

    const allSearchedMangas = await this.searchMangaInDb(keyword);
    return allSearchedMangas.map(
      ({ cover, name, synopsis, url }: MangaSimplified) => {
        return { cover, name, synopsis, url: url.trim() };
      },
    );
  }

  private async saveMangasToDb(mangasToAdd: MangaSimplified[]) {
    try {
      const mangaPages = await axios.all(
        mangasToAdd.map((manga) => {
          this.logger.log(manga.url);
          return axios.get(manga.url, { timeout: 30000 }); // timeout reduced to 30 seconds
        }),
      );

      const scrappedPages = mangaPages.map((page) => load(page.data));

      const mangas: Manga[] = scrappedPages.map(
        (page: CheerioAPI, i: number) => {
          return this.createMangaEntity(page, mangasToAdd[i].url);
        },
      );

      return await this.prisma.novelCoolManga.createMany({
        data: [...mangas],
      });
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        this.logger.error(`A timeout happened on url ${err.config.url}`);
      } else {
        this.logger.error({ errorCode: err.code, errorMessage: err.message });
      }
    }
  }
  private async searchMangaInDb(keyword: string) {
    return this.prisma.novelCoolManga.findMany({
      where: {
        name: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
      select: {
        name: true,
        cover: true,
        url: true,
        synopsis: true,
      },
    });
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

    const randomManga = await this.prisma.novelCoolManga.findFirst({ skip });
    return {
      id: uuid(),
      name: randomManga.name,
      url: randomManga.url,
      cover: randomManga.cover,
      status: randomManga.status,
      updatedAt: randomManga.updatedAt,
      synopsis: randomManga.synopsis,
      genres: randomManga.genres,
      chapters: randomManga.chapters,
    };
  }

  async getManga(url: string): Promise<Manga> {
    try {
      const page = await axios.get(url);
      const scrappedPage = load(page.data);

      return this.createMangaEntity(scrappedPage, url);
    } catch (e) {
      this.logger.log(e);
    }
  }

  private createMangaEntity(
    scrappedMangaPage: CheerioAPI,
    mangaPageUrl: string,
  ): Manga {
    return {
      id: uuid(),
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
        'div.chp-item:nth-child(1) > a:nth-child(1) > div:nth-child(1) > span:nth-child(2)',
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
