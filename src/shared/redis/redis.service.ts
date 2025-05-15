import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisConfig = this.configService.get("redis");
    this.redisClient = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
    });

    this.redisClient.on("error", (error) => {
      console.error("Redis connection error:", error);
    });
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, "EX", ttl);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async setHash(key: string, field: string, value: string): Promise<void> {
    await this.redisClient.hset(key, field, value);
  }

  async getHash(key: string, field: string): Promise<string | null> {
    return await this.redisClient.hget(key, field);
  }

  async getAllHash(key: string): Promise<Record<string, string>> {
    return await this.redisClient.hgetall(key);
  }

  getClient(): Redis {
    return this.redisClient;
  }
}
