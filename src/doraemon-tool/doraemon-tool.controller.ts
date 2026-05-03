import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { DoraemonToolService } from './doraemon-tool.service';
import { GetToolDto } from './dto/get-tool.dto';
import { DoraemonScrapService } from '../services/doraemon-scrap.service';
import { Response } from 'express';
import { HttpStatusCode } from 'axios';
import {
  CustomCacheDeleteInterceptor,
  CustomCacheInterceptor,
  CustomCacheSetPatternInterceptor,
} from '../common/interceptors/cache.interceptor';
import { CACHE_KEY_PREFIX } from '../common/constant/cache.enum';

@Controller('tool')
export class DoraemonToolController {
  constructor(
    private readonly logger: Logger,
    private readonly doraemonToolService: DoraemonToolService,
  ) {}

  @UseInterceptors(CustomCacheInterceptor)
  @Get()
  findAll(@Query() query: GetToolDto) {
    return this.doraemonToolService.findAll(query);
  }

  @UseInterceptors(CustomCacheInterceptor)
  @Get('count')
  count() {
    return this.doraemonToolService.count();
  }

  @Get('random')
  getRandom() {
    return this.doraemonToolService.findByRandom();
  }

  @UseInterceptors(CustomCacheInterceptor)
  @Get('/:id')
  findOne(@Param() param: { id: number }) {
    return this.doraemonToolService.findOne(param);
  }

  @UseInterceptors(
    new CustomCacheSetPatternInterceptor({
      prefix: CACHE_KEY_PREFIX.TOOL,
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
      const result = await DoraemonScrapService.scrapeTools(page);

      if (!result || !result.length) {
        this.logger.log(`Page ${page} is empty`);
        this.logger.log('Finish scraping');
        break;
      }

      this.doraemonToolService.insert(result);

      page += 1;
    }
  }

  @UseInterceptors(
    new CustomCacheSetPatternInterceptor({
      prefix: CACHE_KEY_PREFIX.TOOL,
    }),
  )
  @UseInterceptors(CustomCacheDeleteInterceptor)
  @Post('truncate')
  async truncate(@Res() res) {
    try {
      this.logger.log('Start truncate tools');
      await this.doraemonToolService.truncate();
      this.logger.log('Finish truncate tools');
      res.json({ statusCode: HttpStatusCode.Ok, success: true });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }
}
