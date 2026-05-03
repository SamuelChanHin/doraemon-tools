import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tools } from 'db-schema';
import { RedisModule } from 'src/redis/redis.module';
import { DoraemonToolController } from './doraemon-tool.controller';
import { DoraemonToolService } from './doraemon-tool.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tools]), RedisModule],
  controllers: [DoraemonToolController],
  providers: [DoraemonToolService, Logger],
  exports: [DoraemonToolService],
})
export class DoraemonToolModule {}
