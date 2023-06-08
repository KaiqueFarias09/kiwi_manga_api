import { Injectable } from '@nestjs/common';

import { AnyNode, Cheerio, load } from 'cheerio';
import axios from 'axios';

import { QueryDto, validateDataType } from '../dto';

@Injectable()
export class MangasService {
  async scrapeMangaList(query: QueryDto) {
    if (query.orby === 'latestUpdates') {
      return await this.scrapeRecentMangas(query);
    } else {
      const data = await this.scrapeAdvancedSearch(query);
      return data;
    }
  }

  private async scrapeRecentMangas(query: QueryDto) {
    try {
      const page = await axios.get(
        `https://${query.language}.novelcool.com/category/latest/category_id-${query.genre}.html`,
      );
      const scrappedPage = load(page.data);

      const data = [];
      scrappedPage('div.book-item').each((i, el) => {
        const manga = scrappedPage(el);
        const type = manga
          .find('div:nth-child(1) > a:nth-child(1) > div:nth-child(2)')
          .text();

        if (type !== 'Novel') {
          data.push({
            title: manga
              .find('div:nth-child(4) > a:nth-child(1) > div:nth-child(1)')
              .text()
              .trim(),
            image: manga
              .find('div:nth-child(1) > a:nth-child(1) > img:nth-child(1)')
              .attr('lazy_url'),
            link: manga.find('div:nth-child(1) > a:nth-child(1)').attr('href'),
          });
        }
      });
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  private async scrapeAdvancedSearch(query: QueryDto) {
    try {
      const searchUrl = this.createSearchUrl(query);
      const advancedSearchPage = await axios.get(searchUrl);
      const scrappedPage = load(advancedSearchPage.data);

      const data = [];
      scrappedPage('div.book-item').each((i, el) => {
        const manga = scrappedPage(el);
        const validationInfo = this.createValidationInfo(manga);

        if (this.isValidManga(validationInfo)) {
          data.push({
            title: manga
              .find('div:nth-child(4) > a:nth-child(1) > div:nth-child(1)')
              .text()
              .trim(),
            image: manga
              .find('div:nth-child(1) > a:nth-child(1) > img:nth-child(1)')
              .attr('src'),
            link: manga.find('div:nth-child(1) > a:nth-child(1)').attr('href'),
          });
        }
      });
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  private createSearchUrl(query: QueryDto) {
    // I made this changes to the keyw because they can impact the search results, that's the way that I can produce the most results for search
    let keyw = query.keyw;
    keyw = keyw.charAt(0).toUpperCase() + keyw.slice(1).toLowerCase();

    const searchUrl =
      `https://${query.language}.novelcool.com/search/?name_sel=contain&name=${query.keyw}&author_sel=contain&author=&category_id=${query.genre}&out_category_id=&publish_year=&completed_series=${query.orby}&rate_star=&page=${query.page}`.trim();
    return searchUrl;
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
}
