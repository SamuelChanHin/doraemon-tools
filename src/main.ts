import 'tsconfig-paths/register';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.setGlobalPrefix('doraemon');

  await app.listen(process.env.PORT || 8080, '0.0.0.0');
}
bootstrap();
