import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  private redisClient;

  constructor(@Inject(CACHE_MANAGER) private readonly redisCache: Cache) {
    this.redisClient = this.redisCache.store;
  }

  async get(key: string) {
    return await this.redisCache.get(key);
  }

  async set(key: string, value: any, ttl = 86400) {
    // default 1 day to expire
    await this.redisCache.set(key, value, ttl);
  }

  async reset() {
    await this.redisCache.reset();
  }

  async del(key: string) {
    await this.redisCache.del(key);
  }

  async bulkDelete(keys: string[]) {
    return await Promise.all(
      keys.map((key) => {
        this.redisCache.del(key);
      }),
    );
  }

  async getAllKey() {
    return await this.redisClient.keys();
  }

  async keys(option?: { prefix?: string; regex?: RegExp }): Promise<string[]> {
    const keys = await this.redisClient.keys();

    if (option.prefix)
      return keys.filter((key: string) => key.startsWith(option.prefix));
    if (option.regex)
      return keys.filter((key: string) => option.regex.test(key));

    return keys;
  }

  async deleteAll() {
    const keys = await this.keys();
    return await this.bulkDelete(keys);
  }

  async deletedByPrefix(prefix: string) {
    const keys = await this.keys({ prefix });
    return await this.bulkDelete(keys);
  }

  async deletedByRegex(regex: RegExp) {
    const keys = await this.keys({ regex });
    return await this.bulkDelete(keys);
  }
}
