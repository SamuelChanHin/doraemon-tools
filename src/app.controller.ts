import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth(
    @Headers('x-api-key') apiKey: string,
  ): Promise<{ status: string }> {
    const expectedKey = process.env.API_KEY;
    if (!expectedKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('Invalid API key');
    }
    const ok = await this.appService.checkDatabaseHealth();
    return { status: ok ? 'ok' : 'error' };
  }
}
