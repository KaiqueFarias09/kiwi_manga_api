import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';
import { IMangasRepository } from 'src/core/abstracts/mangas/mangas-repostitory.abstract';
import { Chapter } from 'src/core/entities/chapters';
import { Manga, MangaSimplified, MangaList } from 'src/core/entities/mangas';

@Injectable()
export class MangasServicesService implements IMangasRepository {
  async getManga(url: string): Promise<Manga> {
    try {
      const page = await axios.get(url);
      const scrappedPage = load(page.data);

      return {
        name: scrappedPage('.bk-side-intro-most > h1:nth-child(1)')
          .text()
          .trim(),
        url: url,
        cover: scrappedPage(
          'div.bookinfo-pic:nth-child(1) > a:nth-child(1) > img:nth-child(1)',
        ).attr('src'),
        status: scrappedPage('.bk-cate-type1 > a:nth-child(1)').text().trim(),
        lastUpdatedDate: scrappedPage(
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
      };
    } catch (e) {
      console.log(e);
    }
  }

  private getGenres(mangaPage: CheerioAPI): string[] {
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

  private getChapters(mangaPage: CheerioAPI): Chapter[] {
    const chapters = [];
    mangaPage('div.chp-item').each((_, el) => {
      const chapter = mangaPage(el).find('a:nth-child(1)');
      chapters.push({
        name: chapter
          .find(' div:nth-child(1) > div:nth-child(1) > span:nth-child(1)')
          .text()
          .trim(),
        url: chapter.attr('href'),
        uploadedDate: chapter
          .find('div:nth-child(1) > span:nth-child(2)')
          .text()
          .trim(),
      });
    });

    return chapters;
  }
  getRandomManga(): Promise<Manga> {
    throw new Error('Method not implemented.');
  }
  getMangas(filter?: string): Promise<MangaSimplified> {
    throw new Error('Method not implemented.');
  }
  searchForMangas(keyword: string): Promise<MangaList[]> {
    throw new Error('Method not implemented.');
  }
}
