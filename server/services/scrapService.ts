import axios from 'axios';
import * as cheerio from 'cheerio';
import { Movies } from '../database/entity/movie';
import { Tools } from '../database/entity/tools';

export class DoraemonScrapService {
  static async scrapeTools(page: number): Promise<Partial<Tools>[]> {
    try {
      const BASE_URL = 'https://doranew.net/page';
      const response = await axios.get(`${BASE_URL}/${page}`, {
        timeout: 10000,
      });
      const html = response.data;
      const $ = cheerio.load(html);

      const result: Partial<Tools>[] = [];

      $('article.grid_post-box').each((_idx, el) => {
        const img = $(el).find('img').attr('data-src');
        const title = $(el).find('div.post-title a').text().trim();
        const subtitle = $(el).find('div.post-substr').text().trim();

        if (title) {
          result.push({
            imageUrl: img,
            nameJp: title,
            descriptionJp: subtitle,
          });
        }
      });

      return result;
    } catch (error) {
      console.error(`Error scraping tools page ${page}:`, error);
      return [];
    }
  }

  static async scrapeMovies(page: number): Promise<Partial<Movies>[]> {
    try {
      const BASE_URL = 'https://chinesedora.com/database/movie/page';
      const response = await axios.get(`${BASE_URL}/${page}`, {
        timeout: 10000,
      });
      const html = response.data;
      const $ = cheerio.load(html);

      const result: Partial<Movies>[] = [];

      $('.flex .item').each((_idx, el) => {
        const imageUrl = $(el).find('a img').attr('src');
        const nameTc = $(el).find('span a').text();

        if (nameTc) {
          result.push({ imageUrl, nameTc });
        }
      });

      return result;
    } catch (error) {
      console.error(`Error scraping movies page ${page}:`, error);
      return [];
    }
  }
}
