import cron from "node-cron";
import dotenv from "dotenv";

import initBotTelegram from "./telegram";
import MinecraftServer from "./controller";
import { logger } from "./helpers/logger";

dotenv.config();
console.clear();

(async () => {
	try {		 
     await initBotTelegram();
     await MinecraftServer();

     cron.schedule("0 * * * *", async () => {
       logger({
         context: "APP",
         message: `Executando rotina de atualização do servidor...`,
         type: "info",
       });

       await MinecraftServer();
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
