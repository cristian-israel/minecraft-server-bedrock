import server from "./validations/server";
import recentServer from "./validations/recentServer";
import { logger } from "./helpers/logger";

export default async function controllerServer() {
  try {
    const { worldPath, version } = server();
    const { urlDownload, recentVersion } = await recentServer();

    // Se existir serverPath e worldPath, realizar backup
    if (worldPath) {
      logger({
        context: "APP",
        message: `Realizando backup do servidor...`,
        type: "info",
      });

      // await backupServer(worldPath);
    }

    debugger;

    // Verificar se a versão do servidor é diferente da versão mais recente
    if (version !== recentVersion) {
      logger({
        context: "APP",
        message: `Nova versão do servidor encontrada: ${recentVersion}`,
        type: "info",
      });
    }
  } catch (error) {
    logger({
      context: "APP",
      message: `Erro ao executar a rotina de atualização do servidor: ${error}`,
      type: "error",
    });
  }
}
