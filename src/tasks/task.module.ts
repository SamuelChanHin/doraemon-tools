import { DynamicModule, Logger, Module } from '@nestjs/common';
import { DoraemonMovieModule } from 'src/doraemon-movie/doraemon-movie.module';
import { DoraemonToolModule } from '../doraemon-tool/doraemon-tool.module';
import { DoraemonScrapeMovieService } from './doraemon-scrape-movie.service';
import { DoraemonScrapeToolService } from './doraemon-scrape-tool.service';
import { RedisModule } from '../redis/redis.module';

@Module({})
export class TaskModule {
  static register(): DynamicModule {
    if (!process.env.TASK_ENABLE || process.env.TASK_ENABLE !== 'true') {
      return {
        module: TaskModule,
      };
    }

    return {
      module: TaskModule,
      imports: [DoraemonMovieModule, DoraemonToolModule, RedisModule],
      providers: [
        DoraemonScrapeMovieService,
        DoraemonScrapeToolService,
        Logger,
      ],
    };
  }
}
