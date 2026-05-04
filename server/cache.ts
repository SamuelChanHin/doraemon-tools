import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedis() {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url);
  return redis;
}

// simple in-memory fallback
const memoryCache = new Map<string, any>();
export const cache = {
  async get(key: string) {
    const r = getRedis();
    if (r) return await r.get(key);
    return memoryCache.get(key) || null;
  },
  async set(key: string, value: any, ttlSec?: number) {
    const r = getRedis();
    if (r) {
      if (ttlSec) await r.set(key, JSON.stringify(value), 'EX', ttlSec);
      else await r.set(key, JSON.stringify(value));
      return;
    }
    memoryCache.set(key, value);
    if (ttlSec) setTimeout(() => memoryCache.delete(key), ttlSec * 1000);
  },
  async del(key: string) {
    const r = getRedis();
    if (r) return await r.del(key);
    memoryCache.delete(key);
  },
};
