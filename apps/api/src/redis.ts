import Redis from 'ioredis';

export let redis: Redis | null = null;
export let isRedisFallback = false;

const mockCache = new Map<string, string>();

if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      retryStrategy: () => null, // Do not retry indefinitely
    });

    redis.on('connect', () => {
      console.log('✅ Connected to Redis successfully.');
    });

    redis.on('error', (err) => {
      if (!isRedisFallback) {
        console.warn('⚠️ Redis error. Swapping to REDIS FALLBACK (in-memory cache).');
        isRedisFallback = true;
      }
    });
  } catch (e: any) {
    console.warn('⚠️ Redis initialization failed. Swapping to REDIS FALLBACK (in-memory cache).');
    isRedisFallback = true;
  }
} else {
  isRedisFallback = true;
}

export const getCache = async (key: string): Promise<string | null> => {
  if (isRedisFallback || !redis) {
    return mockCache.get(key) || null;
  }
  try {
    return await redis.get(key);
  } catch (e) {
    return mockCache.get(key) || null;
  }
};

export const setCache = async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
  if (isRedisFallback || !redis) {
    mockCache.set(key, value);
    if (ttlSeconds) {
      setTimeout(() => mockCache.delete(key), ttlSeconds * 1000);
    }
    return;
  }
  try {
    if (ttlSeconds) {
      await redis.set(key, value, 'EX', ttlSeconds);
    } else {
      await redis.set(key, value);
    }
  } catch (e) {
    mockCache.set(key, value);
    if (ttlSeconds) {
      setTimeout(() => mockCache.delete(key), ttlSeconds * 1000);
    }
  }
};

export const delCache = async (key: string): Promise<void> => {
  if (isRedisFallback || !redis) {
    mockCache.delete(key);
    return;
  }
  try {
    await redis.del(key);
  } catch (e) {
    mockCache.delete(key);
  }
};
