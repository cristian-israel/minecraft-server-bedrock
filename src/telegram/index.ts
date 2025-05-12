import TelegramBot from "node-telegram-bot-api";

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
    console.log(`\nAssistente virtual ativo ✅\n`);

    // Trate os erros de polling
    bot.on("polling_error", () => {
      return;
    });
  } catch (error) {
    console.error("Erro ao iniciar o bot:", error);
  }
}
