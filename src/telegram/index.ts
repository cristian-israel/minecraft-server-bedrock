import TelegramBot from "node-telegram-bot-api";
import { logger } from "../helpers/logger";
import { ServerManager } from "../server/serverManager";

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
    bot.on("text", (msg) => {
      if (msg.chat.id !== chatId) {
        bot.sendMessage(
          msg.chat.id,
          "Você não tem permissão para usar este bot. Entre em contato com o administrador."
        );
        return;
      }

      if (!msg.text) return;
      else if (!ServerManager.getRunning())
        return bot.sendMessage(
          chatId,
          "Servidor não está em execução. Não é possível executar comandos."
        );
      else if (ServerManager.getUpdating())
        return bot.sendMessage(
          chatId,
          "Servidor está em atualização. Não é possível executar comandos."
        );

      ServerManager.sendCommand(msg.text);

      bot.sendMessage(
        chatId,
        `${msg.from?.first_name}! seu comando foi enviado com sucesso! (Agora se funcionou ou não, já é outra história) \n\nComando: ${msg.text}`
      );
    });
  } catch (error) {
    console.error("Erro ao iniciar o bot:", error);
  }
}
