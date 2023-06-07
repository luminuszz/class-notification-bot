import "dotenv/config";
import { RedisManager } from "./utils/RedisManager";
import { Bot } from "./utils/bot";
import { Env } from "./utils/env";
import { getOnlyClassCode } from "./utils/getOnlyClassCode";
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
      
        Sala 1: **${getOnlyClassCode(firstClass)}**

        Sala 2: **${getOnlyClassCode(secondClass)}**

        Matricula: **${matricula}**

        Periodo: **${period}**
  
      `;

      await bot.sendMessage(recipient_id, content);
    }
  );
})();
