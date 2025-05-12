import cron from "node-cron";
import dotenv from "dotenv";

import SystemInfo from "./helpers/system";
import updateMinecraftServer from "./controller";
import { logger } from "./helpers/logger";
import { ServerManager } from "./server/serverManager";
import initBotTelegram from "./telegram";

dotenv.config();
console.clear();

(async () => {
  try {
    const { systemType } = SystemInfo.getInstance();

    await initBotTelegram();

    ServerManager.start();
    ServerManager.sendCommand("time set 0");

    cron.schedule("0 * * * *", () => {
      logger({
        context: "APP",
        message: `Executando rotina de atualização do servidor...`,
        type: "info",
      });

      updateMinecraftServer();
    });

    logger({
      context: "APP",
      message: `Sistema de atualização do servidor Bedrock iniciado, sistema operacional: ${systemType}`,
      type: "success",
    });
  } catch (error) {
    logger({
      context: "APP",
      message: `Erro ao iniciar o servidor: ${error}`,
      type: "error",
    });
  }
})();
