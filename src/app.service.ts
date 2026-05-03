import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkDatabaseHealth(): Promise<boolean> {
    // Implement a simple database query to check connectivity
    // For example, if using TypeORM, you might do something like this:
    try {
      await this.dataSource.query('SELECT * FROM tools LIMIT 1');
      return true;
    } catch (error) {
      throw error;
    }
    // Here, we'll just return true for demonstration purposes.
  }
}
