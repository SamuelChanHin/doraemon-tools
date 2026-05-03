import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { TASK_CRON_EXPRESSION, TASK_NAME } from 'src/common/constant/task';
import { DoraemonScrapService } from 'src/services/doraemon-scrap.service';
import { DoraemonMovieService } from '../doraemon-movie/doraemon-movie.service';
import { RedisService } from '../redis/redis.service';
import { CACHE_KEY_PREFIX } from '../common/constant/cache.enum';

@Injectable()
export class DoraemonScrapeMovieService {
  constructor(
    private readonly logger: Logger,
    private schedulerRegistry: SchedulerRegistry,
    private readonly doraemonMovieService: DoraemonMovieService,
    private readonly redisService: RedisService,
  ) {
    const job = new CronJob(
      TASK_CRON_EXPRESSION.everyWeek,
      this.scrapeMvoies.bind(this),
    );
    this.schedulerRegistry.addCronJob(TASK_NAME.SCRAPE_MOVIE, job);
    job.start();
  }

  async scrapeMvoies() {
    this.logger.log('Start the schedule task to scrape movie');

    let page = 1;
    while (true) {
      this.logger.log(`Start to scrape page ${page} data`);
      const result = await DoraemonScrapService.scrapeMovies(page);

      if (!result || !result.length) {
        this.logger.log(`Page ${page} is empty`);
        this.logger.log('Finish scraping');
        break;
      }

      this.doraemonMovieService.insert(result);

      page += 1;
    }

    this.logger.log('Remove movie from cache');
    this.redisService.deletedByPrefix(CACHE_KEY_PREFIX.MOVIE);

    this.logger.log('Finish the schedule task to scrape movie');
  }
}
