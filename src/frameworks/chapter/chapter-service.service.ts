import { Inject, Injectable, Logger } from '@nestjs/common';

import axios from 'axios';
import axiosRetry from 'axios-retry';
import { CheerioAPI, load } from 'cheerio';
import { IChaptersRepository } from '../../core/abstracts';
import { Chapter } from '../../core/entities';
import { MongoService } from '../mongo-prisma/mongo-prisma.service';

axiosRetry(axios, { retries: 3 });
@Injectable()
export class ChapterFrameworkService implements IChaptersRepository {
  private logger = new Logger('ChapterFrameworkService');
  mongoService: MongoService;
  constructor(@Inject(MongoService) mongoService: MongoService) {
    this.mongoService = mongoService;
  }

  async getChapters(mangaId: string): Promise<Chapter[]> {
    const manga = await this.mongoService.chapter.findMany({
      where: {
        novelCoolMangaId: mangaId,
      },
    });
    const chaptersWithNoPages = manga.filter(
      (manga) => manga.pages.length === 0,
    );

    const completeChapters = await Promise.all(
      chaptersWithNoPages.map(async (chapter) => {
        return {
          id: chapter.id,
          pages: await this.scrapeAllChapterPages(chapter.url),
        };
      }),
    );
    const updatedChapters = await Promise.all(
      completeChapters.map(async (chapter) => {
        return this.mongoService.chapter.update({
          where: {
            id: chapter.id,
          },
          data: {
            pages: chapter.pages,
          },
        });
      }),
    );

    return [
      ...manga.filter((manga) => manga.pages.length > 0),
      ...updatedChapters,
    ];
  }

  async getChapter(id: string): Promise<string[]> {
    try {
      const chapter = await this.mongoService.chapter.findUnique({
        where: {
          id: id,
        },
      });

      if (chapter.pages.length > 0) {
        return chapter.pages;
      }

      const chapterPages = await this.scrapeAllChapterPages(chapter.url);
      await this.mongoService.chapter.update({
        where: {
          id: id,
        },
        data: {
          pages: chapterPages,
        },
      });
      return chapterPages;
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async scrapeAllChapterPages(url: string): Promise<string[]> {
    const firstChapterPage = await axios.get(`${url}-10-1.html`);
    const firstScrappedPage = load(firstChapterPage.data);

    const chapterPages: string[] = [];
    firstScrappedPage('div.pic_box > img').each((_, el) => {
      chapterPages.push(firstScrappedPage(el).attr('src'));
    });

    const chapterPagesLinks = this.createArrayOfLinks({
      firstScrappedPage: firstScrappedPage,
      firstChapterLink: url,
    });
    return await this.expandScrappedData({
      pagesLinks: chapterPagesLinks,
      data: chapterPages,
    });
  }

  private async expandScrappedData({
    pagesLinks,
    data,
  }: {
    pagesLinks: string[];
    data: string[];
  }): Promise<string[]> {
    const pages = await axios
      .all(pagesLinks.map((link) => axios.get(link)))
      .then((pageData) => pageData);

    for (let i = 0; i < pages.length; i++) {
      const scrappedPage = load(pages[i].data);
      scrappedPage('div.pic_box > img').each((_, el) => {
        data.push(scrappedPage(el).attr('src'));
      });
    }
    return data;
  }

  private createArrayOfLinks({
    firstScrappedPage,
    firstChapterLink,
  }: {
    firstScrappedPage: CheerioAPI;
    firstChapterLink: string;
  }) {
    const numberOfLinks = Number(
      firstScrappedPage(
        'div.mangaread-pagenav:nth-child(1) > select:nth-child(5)',
      ).text()[3],
    );

    const links = [];
    for (let i = 2; i <= numberOfLinks; i++) {
      links.push(`${firstChapterLink}-10-${i}.html`);
    }
    return links;
  }
}
