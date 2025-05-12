import cron from "node-cron";
import dotenv from "dotenv";
import { chmodSync } from "fs";
import { join } from "path";

import initBotTelegram from "./telegram";
import updateMinecraftServer from "./controller";
import { logger } from "./helpers/logger";
import SystemInfo from "./helpers/system";

dotenv.config();
console.clear();

const { systemType } = SystemInfo.getInstance();
import { SERVER_DIR } from "./helpers/paths";

if (systemType === "Linux") {
  try {
    chmodSync(join(SERVER_DIR, "bedrock_server"), 0o755);
    logger({
      context: "PERMISSIONS",
      message: "Permissões de execução aplicadas ao bedrock_server.",
      type: "info",
    });
  } catch (err) {
    logger({
      context: "PERMISSIONS",
      message: `Erro ao aplicar permissão: ${err}`,
      type: "error",
    });

    process.exit(1);
  }
}


(async () => {
   try {
     await initBotTelegram();
     await updateMinecraftServer();

     cron.schedule("0 * * * *", async () => {
       logger({
         context: "APP",
         message: `Executando rotina de atualização do servidor...`,
         type: "info",
       });

       await updateMinecraftServer();
     });

     logger({
       context: "APP",
       message: `Sistema de atualização do servidor Bedrock iniciado`,
       type: "success",
     });
   } catch (error) {
     logger({
       context: "APP",
       message: `Erro ao iniciar o servidor: ${error}`,
       type: "error",
     });

     process.exit(1);
   }
 })();
