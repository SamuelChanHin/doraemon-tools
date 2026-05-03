import axios from 'axios';
import cheerio from 'cheerio';
import { Movies, Tools } from 'db-schema';

export class DoraemonScrapService {
  static async scrapeTools(page: number): Promise<Partial<Tools>[]> {
    try {
      const BASE_URL = 'https://doranew.net/page';
      // Go to the dev.to tags page
      const response = await axios.get(`${BASE_URL}/${page}`);
      // Get the HTML code of the webpage
      const html = response.data;
      const $ = cheerio.load(html);

      const result: Partial<Tools>[] = [];

      // Find all elements with crayons-tag class, find their innerText and add them to the tags array
      $('article.grid_post-box').each((_idx, el) => {
        const img = $(el).find('img').attr('data-src');
        const title = $(el).find('div.post-title a').text().trim();
        const subtitle = $(el).find('div.post-substr').text().trim();

        result.push({
          imageUrl: img,
          nameJp: title,
          descriptionJp: subtitle,
        });
      });

      return result;
    } catch (error) {
      return null;
    }
  }

  static async scrapeMovies(page: number) {
    try {
      const BASE_URL = 'https://chinesedora.com/database/movie/page';
      // Go to the dev.to tags page
      const response = await axios.get(`${BASE_URL}/${page}`);
      // Get the HTML code of the webpage
      const html = response.data;
      const $ = cheerio.load(html);

      const result: Partial<Movies>[] = [];

      $('.flex .item').each((_idx, el) => {
        const imageUrl = $(el).find('a img').attr('src');
        const nameTc = $(el).find('span a').text();

        result.push({ imageUrl, nameTc });
      });

      return result;
    } catch (error) {
      return null;
    }
  }

  static async scrapeMovies2() {
    try {
      const BASE_URL = 'https://www.themoviedb.org';
      // Go to the dev.to tags page
      const response = await axios.get(
        `${BASE_URL}/collection/148065-doraemon`,
      );
      // Get the HTML code of the webpage
      const html = response.data;
      const $ = cheerio.load(html);

      const result: Partial<Movies>[] = [];

      $('.results_page>div').each((_idx, el) => {
        console.log(`${_idx} ...`);

        const imageUrl = BASE_URL + $(el).find('.image img').attr('src');
        const nameTc = $(el).find('.title a').text();
        const publishDate = $(el).find('.title .release_date').text();
        console.log(nameTc);
        // console.log({ imageUrl, nameTc, publishDate });
        result.push({ imageUrl, nameTc, publishDate });
      });

      return result;
    } catch (error) {
      return null;
    }
  }

  static async scrapeMovies3(): Promise<Partial<Movies>[]> {
    try {
      const BASE_URL =
        'https://doraemon.fandom.com/zh/wiki/%E5%93%86%E5%95%A6A%E5%A4%A2%E5%8B%95%E7%95%AB%E9%9B%BB%E5%BD%B1?variant=zh-hk';
      // Go to the dev.to tags page
      const response = await axios.get(`${BASE_URL}`);
      // Get the HTML code of the webpage
      const html = response.data;
      const $ = cheerio.load(html);

      const result: Partial<Movies>[] = [];

      // Find all elements with crayons-tag class, find their innerText and add them to the tags array
      $('center table tbody td').each((_idx, el) => {
        console.log(`${_idx} ...`);
        try {
          let imageUrl: string;
          let nameTc: string;
          let publishDate: string;

          $(el)
            .find('a')
            .each((idx, el) => {
              switch (idx) {
                case 0: {
                  const dataSrc = $(el).find('img').attr('data-src');
                  const src = $(el).find('img').attr('src');
                  imageUrl = dataSrc
                    ? dataSrc.startsWith('https')
                      ? dataSrc
                      : src
                    : src;
                  break;
                }
                case 1: {
                  nameTc = $(el).text();
                  break;
                }
                case 2: {
                  publishDate = $(el).text();
                  break;
                }
              }
            });

          result.push({ imageUrl, nameTc, publishDate });
        } catch (error) {
          console.log(error);
        }
      });

      return result;
    } catch (error) {
      return null;
    }
  }
}
