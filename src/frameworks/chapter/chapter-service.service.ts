import { Injectable } from '@nestjs/common';

import { CheerioAPI, load } from 'cheerio';
import axios from 'axios';
import { IChaptersRepository } from 'src/core/abstracts';

@Injectable()
export class ChapterFrameworkService implements IChaptersRepository {
  async getChapter(url: string): Promise<string[]> {
    try {
      const firstChapterPage = await axios.get(`${url}-10-1.html`);
      const firstScrappedPage = load(firstChapterPage.data);

      let data: string[] = [];
      firstScrappedPage('div.pic_box > img').each((_, el) => {
        data.push(firstScrappedPage(el).attr('src'));
      });

      const chapterPagesLinks = this.createArrayOfLinks({
        firstScrappedPage: firstScrappedPage,
        firstChapterLink: url,
      });
      data = await this.expandScrappedData({
        pagesLinks: chapterPagesLinks,
        data: data,
      });

      return data;
    } catch (e) {
      console.log(e);
    }
  }
  getChapters(mangaUrl: string): Promise<string[]> {
    throw new Error('Method not implemented.');
  }

  private async expandScrappedData({
    pagesLinks,
    data,
  }: {
    pagesLinks: Array<any>;
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
