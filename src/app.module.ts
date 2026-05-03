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
import { ScheduleModule } from '@nestjs/schedule';

const isVercelDeployment = process.env.VERCEL === '1';
const enableScheduledTasks =
  process.env.TASK_ENABLE === 'true' && !isVercelDeployment;
const taskModuleImport = enableScheduledTasks
  ? [require('./tasks/task.module').TaskModule.register()]
  : [];
const staticModuleImport = !isVercelDeployment
  ? [
      ServeStaticModule.forRoot({
        rootPath: join(process.cwd(), 'client'),
      }),
    ]
  : [];
const scheduleModuleImport = !isVercelDeployment
  ? [ScheduleModule.forRoot()]
  : [];

@Module({
  imports: [
    ...taskModuleImport,
    DoraemonMovieModule,
    DoraemonToolModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Tools, Movies],
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ...staticModuleImport,
    ...scheduleModuleImport,
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
