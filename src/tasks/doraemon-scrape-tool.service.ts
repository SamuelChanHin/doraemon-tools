import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { RedisService } from '../redis/redis.service';
import { TASK_CRON_EXPRESSION, TASK_NAME } from '../common/constant/task';
import { DoraemonToolService } from '../doraemon-tool/doraemon-tool.service';
import { CACHE_KEY_PREFIX } from '../common/constant/cache.enum';
import { DoraemonScrapService } from '../services/doraemon-scrap.service';

@Injectable()
export class DoraemonScrapeToolService {
  constructor(
    private readonly logger: Logger,
    private schedulerRegistry: SchedulerRegistry,
    private readonly doraemonToolService: DoraemonToolService,
    private readonly redisService: RedisService,
  ) {
    const job = new CronJob(
      TASK_CRON_EXPRESSION.everyWeek,
      this.scrapeMvoies.bind(this),
    );
    this.schedulerRegistry.addCronJob(TASK_NAME.SCRAPE_TOOL, job);
    job.start();
  }

  async scrapeMvoies() {
    this.logger.log('Start the schedule task to scrape tool');

    let page = 1;
    while (true) {
      this.logger.log(`Start to scrape page ${page} data`);
      const result = await DoraemonScrapService.scrapeTools(page);

      if (!result || !result.length) {
        this.logger.log(`Page ${page} is empty`);
        this.logger.log('Finish scraping');
        break;
      }

      this.doraemonToolService.insert(result);

      page += 1;
    }

    this.logger.log('Remove movie from cache');
    this.redisService.deletedByPrefix(CACHE_KEY_PREFIX.TOOL);

    this.logger.log('Finish the schedule task to scrape tool');
  }
}
