import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://:swen2026secure_redis@100.111.6.13:6379';

let redis: any = null;

export async function getRedis() {
  if (!redis) {
    redis = createClient({ url: redisUrl });
    redis.on('error', (err: any) => console.error('Redis error:', err));
    await redis.connect();
  }
  return redis;
}

export async function addFeedScore(userName: string, points: number = 1) {
  const r = await getRedis();
  return r.zIncrBy('leaderboard:feeds', points, userName);
}

export async function getLeaderboard(limit: number = 10) {
  const r = await getRedis();
  const results = await r.zRangeWithScores('leaderboard:feeds', 0, limit - 1, { REV: true });
  return results.map((item: any, rank: number) => ({
    rank: rank + 1,
    name: item.value,
    score: item.score,
  }));
}

export async function getUserRank(userName: string) {
  const r = await getRedis();
  const rank = await r.zRevRank('leaderboard:feeds', userName);
  const score = await r.zScore('leaderboard:feeds', userName);
  return { rank: rank !== null ? rank + 1 : null, score: Number(score) || 0 };
}

export async function incrementSpeciesFeed(speciesId: number) {
  const r = await getRedis();
  return r.incr(`species:${speciesId}:feed_count`);
}

export async function getSpeciesFeedCount(speciesId: number) {
  const r = await getRedis();
  const count = await r.get(`species:${speciesId}:feed_count`);
  return parseInt(String(count || '0'));
}

export async function checkRateLimit(key: string, seconds: number = 5): Promise<boolean> {
  const r = await getRedis();
  const exists = await r.exists(`ratelimit:${key}`);
  if (exists) return false;
  await r.setEx(`ratelimit:${key}`, seconds, '1');
  return true;
}

export async function publishFeed(data: any) {
  const r = await getRedis();
  return r.publish('feed-updates', JSON.stringify(data));
}
