import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movies } from 'db-schema';
import { RedisModule } from 'src/redis/redis.module';
import { DoraemonMovieController } from './doraemon-movie.controller';
import { DoraemonMovieService } from './doraemon-movie.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movies]), RedisModule],
  controllers: [DoraemonMovieController],
  providers: [DoraemonMovieService, Logger],
  exports: [DoraemonMovieService],
})
export class DoraemonMovieModule {}
