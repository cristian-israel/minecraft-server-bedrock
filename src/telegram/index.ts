import TelegramBot from "node-telegram-bot-api";
import { logger } from "../helpers/logger";

export default async function initBotTelegram(): Promise<{
  nome_bot: string;
  bot: TelegramBot;
} | void> {
  try {
    // Inicialize o bot com o token fornecido
    const bot = new TelegramBot(
      process.env.TELEGRAM_MINECRAFT_BEDROCK_SERVER_BOT as string,
      { polling: true }
    );

    // Informe que o bot está ativo
    logger({
      context: "TELEGRAM",
      message: `Bot Telegram iniciado com sucesso.`,
      type: "success",
    });

    // Trate os erros de polling
    bot.on("polling_error", () => {
      return;
    });
  } catch (error) {
    console.error("Erro ao iniciar o bot:", error);
  }
}
