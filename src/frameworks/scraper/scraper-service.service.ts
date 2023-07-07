import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AnyNode, Cheerio, CheerioAPI, load } from 'cheerio';
import { Chapter } from '../../core/entities/chapters';
import { MangaEntity, MangaSimplified } from '../../core/entities/mangas';

@Injectable()
export class ScraperServiceService {
  private logger = new Logger('MangasServicesService');

  scrapeGenres(mangaPage: CheerioAPI): string[] {
    const genres: string[] = [];
    mangaPage(
      'div.for-pc:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div',
    ).each((_, el) => {
      genres.push(mangaPage(el).text().trim());
    });

    genres.shift();
    return genres;
  }

  scrapeChapters(mangaPage: CheerioAPI): Chapter[] {
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

  async scrapeAdvancedSearch(keyword: string): Promise<MangaSimplified[]> {
    try {
      const searchUrl =
        `https://br.novelcool.com/search/?name_sel=contain&name=${keyword}`.trim();
      const advancedSearchPage = await axios.get(searchUrl);
      const scrappedPage = load(advancedSearchPage.data);

      const data: MangaSimplified[] = [];
      scrappedPage('div.book-item').each((_, el) => {
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

  private createValidationInfo(manga: Cheerio<AnyNode>) {
    const validationInfo: ValidationDataType = {
      type: manga
        .find('div:nth-child(1) > a:nth-child(1) > div:nth-child(2)')
        .text(),
      mangaName: manga
        .find('div:nth-child(4) > a:nth-child(1) > div:nth-child(1)')
        .text()
        .trim(),
      mangaViews: Number(
        manga
          .find(
            'div:nth-child(4) > a:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(2)',
          )
          .text()
          .replace(',', '.'),
      ),
    };
    return validationInfo;
  }

  private isValidManga(validateData: ValidationDataType) {
    if (
      !validateData.mangaName.toLowerCase().includes('novel') &&
      validateData.mangaViews > 1
    ) {
      return true;
    }
  }

  createMangaEntityFromScrappedData({
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
      genres: this.scrapeGenres(scrappedMangaPage),
      chapters: this.scrapeChapters(scrappedMangaPage),
      hasCover: hasCover,
      source: 'novelcool',
    };
  }
}

class ValidationDataType {
  type: string;
  mangaName: string;
  mangaViews: number;
}
