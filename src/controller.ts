import { logger } from "./helpers/logger";
import server from "./validations/server";

export default function controllerServer() {
  try {
    const { serverPath, worldPath, version } = server();

    debugger;
  } catch (error) {
    logger({
      context: "APP",
      message: `Erro ao executar a rotina de atualização do servidor: ${error}`,
      type: "error",
    });
  }
}
