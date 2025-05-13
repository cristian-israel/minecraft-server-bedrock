import { logger } from "../../helpers/logger";
import { ServerManager } from "../../server/serverManager";

// Lista de comandos perigosos que devem ser bloqueados
const forbiddenCommands = [
  "stop", // pode desligar o servidor à força
  "shutdown", // pode desligar o sistema (Linux/Windows)
  "poweroff", // Linux
  "reboot", // Linux
  "halt", // Linux
  "taskkill", // Windows
  "rm -rf /", // Linux destrutivo
  "exit", // encerrar shell
  "logout", // encerrar sessão
  "kill", // comandos perigosos de sinalização
  "systemctl", // comandos de sistema no Linux
  "net stop", // Windows
  "net start", // Windows
];

export function receiveMessage(bot: any, chatId: number): void {
  try {
    bot.on("text", async (msg: any) => {
      const userId = msg.chat.id;
      const text = msg.text?.trim();
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

      // Proteção contra comandos perigosos
      const lowerText = text.toLowerCase();
      const isForbidden = forbiddenCommands.some((cmd) =>
        lowerText.startsWith(cmd)
      );

      if (isForbidden) {
        return bot.sendMessage(
          chatId,
          `⚠️ O comando enviado foi bloqueado por questões de segurança.\n\nComando: \`${text}\``
        );
      }

      if (!ServerManager.getRunning()) {
        return bot.sendMessage(chatId, "Servidor não está em execução.");
      }

      if (ServerManager.getUpdating()) {
        return bot.sendMessage(chatId, "Servidor está em atualização.");
      }

      // Comando permitido: envia ao servidor Minecraft
      await ServerManager.sendCommand(text);

      return bot.sendMessage(
        chatId,
        `${firstName}, seu comando foi enviado com sucesso! 🚀\n\nComando: \`${text}\``
      );
    });
  } catch (error) {
    logger({
      context: "TELEGRAM",
      message: `Erro ao processar mensagem: ${error}`,
      type: "error",
    });

    return bot.sendMessage(
      chatId,
      `Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.`
    );
  }
}
