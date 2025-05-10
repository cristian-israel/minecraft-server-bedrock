import cron from "node-cron";

import SystemInfo from "./helpers/system";
import updateMinecraftServer from "./controller";
import { logger } from "./helpers/logger";
import { serverManager } from "./server/serverManager";

console.clear();

const { systemType } = SystemInfo.getInstance();

logger({
  context: "APP",
  message: `Sistema de atualização do servidor Bedrock iniciado, sistema operacional: ${systemType}`,
  type: "success",
});

serverManager.start();

// cron.schedule("0 * * * *", () => {

// logger({
//   context: "APP",
//   message: `Executando rotina de atualização do servidor...`,
//   type: "info",
// });

// updateMinecraftServer();
// });
