const { redisClient } = require('../config/redis');
const logger = require('./logger');

class Cache {
  constructor() {
    this.client = redisClient;
  }

  async set(key, value, ttl = 3600) {
    try {
      const val = typeof value === 'object' ? JSON.stringify(value) : value;
      await this.client.set(key, val, { EX: ttl });
    } catch (err) {
      logger.error('Cache set error:', err);
    }
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch (err) {
      logger.error('Cache get error:', err);
      return null;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      logger.error('Cache delete error:', err);
    }
  }

  async flush() {
    try {
      await this.client.flushAll();
    } catch (err) {
      logger.error('Cache flush error:', err);
    }
  }
}

module.exports = new Cache();