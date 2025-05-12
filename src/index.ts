import cron from "node-cron";
import dotenv from "dotenv";

import initBotTelegram from "./telegram";
import updateMinecraftServer from "./controller";
import { logger } from "./helpers/logger";

dotenv.config();
console.clear();

import { SERVER_DIR, CACHE_DIR, CONFIG_SERVER_FILE } from "./helpers/paths";

console.log(SERVER_DIR);
console.log(CACHE_DIR);
console.log(CONFIG_SERVER_FILE);

// (async () => {
//   try {
//     await initBotTelegram();
//     await updateMinecraftServer();

//     cron.schedule("0 * * * *", async () => {
//       logger({
//         context: "APP",
//         message: `Executando rotina de atualização do servidor...`,
//         type: "info",
//       });

//       await updateMinecraftServer();
//     });

//     logger({
//       context: "APP",
//       message: `Sistema de atualização do servidor Bedrock iniciado`,
//       type: "success",
//     });
//   } catch (error) {
//     logger({
//       context: "APP",
//       message: `Erro ao iniciar o servidor: ${error}`,
//       type: "error",
//     });

//     process.exit(1);
//   }
// })();
