import "dotenv/config";
import { RedisManager } from "./utils/RedisManager";
import { Bot } from "./utils/bot";
import { Env } from "./utils/env";
import { logger } from "./utils/logger";

interface ClassMessage {
  firstClass: string;
  secondClass: string;
  period: string;
  matricula: string;
  sent: boolean;
  recipient_id: string;
}

(async () => {
  logger.info("Starting notification service");

  const redis = RedisManager.getConnection({
    host: Env.get("REDIS_HOST"),
    password: Env.get("REDIS_PASSWORD"),
    port: Env.get("REDIS_PORT"),
  });

  logger.info("Connection to redis established");

  const bot = Bot.connect(Env.get("TELEGRAM_NOTIFICATION_BOT"));

  logger.info("Connection to telegram bot established");

  redis.listenToChannel<ClassMessage>(
    "topics:notification-class",
    async ({ firstClass, matricula, period, recipient_id, secondClass }) => {
      const content = `
      ** ⏳⏳⏳ AULAS DE HOJE  ⏳⏳⏳ **
      
        Primeira aula: ${firstClass}
        
        Segunda aula: ${secondClass}
      
        Periodo: **${period}**
        
        Matricula: **${matricula}**
  
      `;

      await bot.sendMessage(recipient_id, content);
    }
  );
})();
