import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DoraemonToolModule } from './doraemon-tool/doraemon-tool.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Tools, Movies } from 'db-schema';
import { DoraemonMovieModule } from './doraemon-movie/doraemon-movie.module';
import { TaskModule } from './tasks/task.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TaskModule,
    DoraemonMovieModule,
    DoraemonToolModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Tools, Movies],
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
