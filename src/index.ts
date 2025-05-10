import SystemInfo from "./helpers/system";
import { logger } from "./helpers/logger";
import controllerServer from "./controller";
import cron from "node-cron";

console.clear();

const { type: systemType } = SystemInfo.getInstance();

logger({
  context: "APP",
  message: `Sistema de atualização do servidor Bedrock iniciado, sistema operacional: ${systemType}`,
  type: "success",
});

// cron.schedule("0 * * * *", () => {

logger({
  context: "APP",
  message: `Executando rotina de atualização do servidor...`,
  type: "info",
});

controllerServer();
// });
