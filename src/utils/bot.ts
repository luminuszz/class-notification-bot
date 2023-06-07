import { Telegraf } from "telegraf";

export class Bot {
  private static instance: Bot;

  private readonly telegraf: Telegraf;

  private constructor(bot_id: string) {
    this.telegraf = new Telegraf(bot_id);
  }

  static connect(bot_id: string) {
    if (!Bot.instance) {
      Bot.instance = new Bot(bot_id);
    }

    return Bot.instance;
  }

  private parseContent(content: string): string {
    return content
      .replaceAll("_", "\\_")
      .replaceAll("**", "\\**")
      .replaceAll("[", "\\[")
      .replaceAll("]", "\\]")
      .replaceAll("`", "\\`")
      .replaceAll("-", "\\-")
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)")
      .replaceAll(".", "\\.")
      .replaceAll("!", "\\!")
      .replaceAll(">", "\\>")
      .replaceAll("<", "\\<");
  }

  public async sendMessage(chat_id: string, message: string) {
    await this.telegraf.telegram.sendMessage(
      chat_id,
      this.parseContent(message),
      {
        parse_mode: "MarkdownV2",
        entities: [
          {
            type: "bold",
            offset: 201,
            length: 5,
          },
        ],
      }
    );
  }
}
