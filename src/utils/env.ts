export interface EnvType {
  TELEGRAM_NOTIFICATION_BOT: string;
  TELEGRAM_CHAT_ID: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
}

export class Env {
  private static env: EnvType = process.env as unknown as EnvType;

  static get<T extends keyof EnvType>(key: T): (typeof Env.env)[T] {
    Env.env.REDIS_PORT;

    return Env.env[key] as any;
  }
}
