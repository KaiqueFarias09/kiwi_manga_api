import { Injectable } from '@nestjs/common';

import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';

@Injectable()
export class MangaService {
  async scrapeMangaInfo(url: string) {
    try {
      const page = await axios.get(url);
      const scrappedPage = load(page.data);

      const data = [];
      data.push({
        title: scrappedPage('.bk-side-intro-most > h1:nth-child(1)')
          .text()
          .trim(),
        image: scrappedPage(
          'div.bookinfo-pic:nth-child(1) > a:nth-child(1) > img:nth-child(1)',
        ).attr('src'),
        status: scrappedPage('.bk-cate-type1 > a:nth-child(1)').text().trim(),
        lastUpdated: scrappedPage(
          'div.chp-item:nth-child(1) > a:nth-child(1) > div:nth-child(1) > span:nth-child(2)',
        )
          .text()
          .trim(),
        synopsis: scrappedPage(
          'div.for-pc:nth-child(3) > div:nth-child(2) > div:nth-child(1)',
        )
          .text()
          .trim(),
        genres: this.getGenres(scrappedPage),
        chapters: this.getChapters(scrappedPage),
      });

      return data;
    } catch (e) {
      console.log(e);
    }
  }

  private getGenres(mangaPage: CheerioAPI) {
    const genres = [];
    mangaPage(
      'div.for-pc:nth-child(3) > div:nth-child(3) > div:nth-child(1) > div',
    ).each((_, el) => {
      genres.push({
        genre: mangaPage(el).text().trim(),
      });
    });

    genres.shift();
    return genres;
  }

  private getChapters(mangaPage: CheerioAPI) {
    const chapters = [];
    mangaPage('div.chp-item').each((_, el) => {
      const chapter = mangaPage(el).find('a:nth-child(1)');
      chapters.push({
        chapterTitle: chapter
          .find(' div:nth-child(1) > div:nth-child(1) > span:nth-child(1)')
          .text()
          .trim(),
        chapterLink: chapter.attr('href'),
        uploadedDate: chapter
          .find('div:nth-child(1) > span:nth-child(2)')
          .text()
          .trim(),
      });
    });

    return chapters;
  }
}
