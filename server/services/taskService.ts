import { cache } from '../cache';
import { insertMovies } from './movieService';
import { DoraemonScrapService } from './scrapService';
import { insertTools } from './toolService';

const CACHE_PREFIX = 'doraemon:';

export class DoraemonTaskService {
  static async scrapeMovies() {
    try {
      console.log('[TASK] Starting movie scraping task');

      let page = 1;
      let hasMore = true;
      const batchSize = 50;
      let totalInserted = 0;

      while (hasMore) {
        console.log(`[TASK] Scraping movies page ${page}`);
        const result = await DoraemonScrapService.scrapeMovies(page);

        if (!result || result.length === 0) {
          console.log(`[TASK] Page ${page} returned no results, stopping`);
          hasMore = false;
          break;
        }

        // Insert results as Movies entities
        await insertMovies(result as any);
        totalInserted += result.length;

        page += 1;
      }

      console.log(`[TASK] Scraped ${totalInserted} movies total`);

      // Clear cache for movies
      console.log('[TASK] Clearing movie cache');
      const keys = await cache.keys(`${CACHE_PREFIX}movie:*`);
      if (keys.length > 0) {
        await cache.del(keys);
      }

      console.log('[TASK] Movie scraping task completed successfully');
      return { status: 'success', totalInserted };
    } catch (error) {
      console.error('[TASK] Error during movie scraping:', error);
      throw error;
    }
  }

  static async scrapeTools() {
    try {
      console.log('[TASK] Starting tool scraping task');

      let page = 1;
      let hasMore = true;
      let totalInserted = 0;

      while (hasMore) {
        console.log(`[TASK] Scraping tools page ${page}`);
        const result = await DoraemonScrapService.scrapeTools(page);

        if (!result || result.length === 0) {
          console.log(`[TASK] Page ${page} returned no results, stopping`);
          hasMore = false;
          break;
        }

        // Insert results as Tools entities
        await insertTools(result as any);
        totalInserted += result.length;

        page += 1;
      }

      console.log(`[TASK] Scraped ${totalInserted} tools total`);

      // Clear cache for tools
      console.log('[TASK] Clearing tool cache');
      const keys = await cache.keys(`${CACHE_PREFIX}tool:*`);
      if (keys.length > 0) {
        await cache.del(keys);
      }

      console.log('[TASK] Tool scraping task completed successfully');
      return { status: 'success', totalInserted };
    } catch (error) {
      console.error('[TASK] Error during tool scraping:', error);
      throw error;
    }
  }

  static async scrapeAll() {
    try {
      console.log('[TASK] Starting full scraping task');
      const movieResult = await this.scrapeMovies();
      const toolResult = await this.scrapeTools();
      console.log('[TASK] Full scraping task completed');
      return {
        status: 'success',
        movies: movieResult,
        tools: toolResult,
      };
    } catch (error) {
      console.error('[TASK] Error during full scraping task:', error);
      throw error;
    }
  }
}
