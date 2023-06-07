import { Redis } from "ioredis";

interface RedisConfig {
  host: string;
  port: number;
  password: string;
}

export class RedisManager {
  private readonly redis: Redis;

  static instance: RedisManager;

  private constructor({ host, password, port }: RedisConfig) {
    this.redis = new Redis({
      host,
      port,
      password,
    });
  }

  static getConnection(config: RedisConfig) {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager(config);
    }

    return RedisManager.instance;
  }

  public async listenToChannel<MessageType = unknown>(
    channel: string,
    callback: (message: MessageType) => void
  ) {
    await this.redis.subscribe(channel, (err) => {
      if (err) {
        throw err;
      }
    });

    this.redis.on("message", async (currentChannelMessageEvent, message) => {
      if (currentChannelMessageEvent === channel) {
        callback(JSON.parse(message));
      }
    });

    return this.unSubscribe.bind(this, channel);
  }

  public async unSubscribe(channel: string) {
    await this.redis.unsubscribe(channel);
  }

  public async set(key: string, value: any) {
    await this.redis.set(key, JSON.stringify(value));
  }
}
