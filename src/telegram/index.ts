import TelegramBot from "node-telegram-bot-api";
import { logger } from "../helpers/logger";
import { receiveMessage } from "./controllers/receiveMessage";

export default async function initBotTelegram(): Promise<void> {
  const chatId = Number(process.env.TELEGRAM_CHAT_ID_ADMIN);

  // Verifique se o token do bot está definido
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

    // Escutar mensagens de texto
    receiveMessage(bot, chatId);
  } catch (error) {
    console.error("Erro ao iniciar o bot:", error);
  }
}
