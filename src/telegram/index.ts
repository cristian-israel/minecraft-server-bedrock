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
    bot.on("text", async (msg) => {
      const userId = msg.chat.id;
      const text = msg.text;
      const firstName = msg.from?.first_name ?? "Usuário";

      if (userId !== chatId) {
        return bot.sendMessage(
          userId,
          "Você não tem permissão para usar este bot. Entre em contato com o administrador."
        );
      }

      if (!text) return;

      // Comandos administrativos
      if (text === "/startServer") {
        await ServerManager.start();
        return bot.sendMessage(
          chatId,
          "Servidor iniciado (ou já estava em execução)."
        );
      }

      if (text === "/stopServer") {
        await ServerManager.stop();
        return bot.sendMessage(
          chatId,
          "Servidor encerrado (ou já estava parado)."
        );
      }

      // Validações antes de executar comandos genéricos
      if (!ServerManager.getRunning()) {
        return bot.sendMessage(chatId, "Servidor não está em execução.");
      }

      if (ServerManager.getUpdating()) {
        return bot.sendMessage(chatId, "Servidor está em atualização.");
      }

      // Envia comando genérico
      await ServerManager.sendCommand(text);

      return bot.sendMessage(
        chatId,
        `${firstName}, seu comando foi enviado com sucesso! 🚀\n\nComando: \`${text}\`\n(Agora se funcionou ou não, já é outra história 😅)`
      );
    });
  } catch (error) {
    console.error("Erro ao iniciar o bot:", error);
  }
}
