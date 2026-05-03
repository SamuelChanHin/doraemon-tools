import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function createNestApp() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('doraemon');

  await app.init();

  return app;
}