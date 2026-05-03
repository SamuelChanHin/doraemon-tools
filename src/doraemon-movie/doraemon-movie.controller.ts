import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  Logger,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { DoraemonMovieService } from './doraemon-movie.service';
import { GetMovieDto } from './dto/get-movie.dto';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';
import { DoraemonScrapService } from 'src/services/doraemon-scrap.service';
import {
  CustomCacheDeleteInterceptor,
  CustomCacheInterceptor,
} from '../common/interceptors/cache.interceptor';
import { CustomCacheSetPatternInterceptor } from '../common/interceptors/cache.interceptor';
import { CACHE_KEY_PREFIX } from '../common/constant/cache.enum';

@Controller('movie')
export class DoraemonMovieController {
  constructor(
    private readonly doraemonMovieService: DoraemonMovieService,
    private readonly logger: Logger,
  ) {}

  @UseInterceptors(CustomCacheInterceptor)
  @Get()
  findAll(@Query() query: GetMovieDto) {
    return this.doraemonMovieService.findAll(query);
  }

  @UseInterceptors(CustomCacheInterceptor)
  @Get('count')
  count() {
    return this.doraemonMovieService.count();
  }

  @Get('random')
  getRandom() {
    return this.doraemonMovieService.findByRandom();
  }

  @UseInterceptors(CustomCacheInterceptor)
  @Get('/:id')
  findOne(@Param() param: { id: number }) {
    return this.doraemonMovieService.findOne(param);
  }

  @UseInterceptors(
    new CustomCacheSetPatternInterceptor({
      prefix: CACHE_KEY_PREFIX.MOVIE,
    }),
  )
  @UseInterceptors(CustomCacheDeleteInterceptor)
  @Post('scrape')
  async scape(@Res() res: Response) {
    this.logger.log('Start scraping');
    res.json({ statusCode: HttpStatusCode.Ok, success: true });

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

    this.logger.log('Finish scraping');
  }

  @UseInterceptors(
    new CustomCacheSetPatternInterceptor({
      prefix: CACHE_KEY_PREFIX.MOVIE,
    }),
  )
  @UseInterceptors(CustomCacheDeleteInterceptor)
  @Post('truncate')
  async truncate(@Res() res) {
    try {
      this.logger.log('Start truncate moives');
      await this.doraemonMovieService.truncate();
      this.logger.log('Finish truncate moives');
      res.json({ statusCode: HttpStatusCode.Ok, success: true });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }
}
