import "dotenv/config";
import { RedisManager } from "./utils/RedisManager";
import { Bot } from "./utils/bot";
import { Env } from "./utils/env";

interface ClassMessage {
  firstClass: string;
  secondClass: string;
  period: string;
  matricula: string;
  sent: boolean;
  recipient_id: string;
}

(async () => {
  const redis = RedisManager.getConnection({
    host: Env.get("REDIS_HOST"),
    password: Env.get("REDIS_PASSWORD"),
    port: Env.get("REDIS_PORT"),
  });

  const bot = Bot.connect(Env.get("TELEGRAM_NOTIFICATION_BOT"));

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
