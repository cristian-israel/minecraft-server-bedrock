import { SERVER_DIR } from "./helpers/paths";

import server from "./validations/server";
import recentServer from "./validations/recentServer";
import create from "./backup/create";

import downloadServer from "./download";
import extract from "./download/extract";
import { logger } from "./helpers/logger";

export default async function controllerServer() {
  try {
    const { worldPath, version } = server();
    const { urlDownload, recentVersion } = await recentServer();

    // Verificar se a versão do servidor é igual da versão mais recente
    if (version === recentVersion) {
      logger({
        context: "APP",
        message: `Servidor já está atualizado para a versão mais recente: ${version}`,
        type: "info",
      });

      return;

      // Se existir worldPath, realizar backup do mundo
    } else if (worldPath) {
      logger({
        context: "APP",
        message: `Realizando backup do servidor...`,
        type: "info",
      });

      await create(worldPath);
    }

    // Instalar a versão mais recente do servidor
    logger({
      context: "APP",
      message: `Baixando a versão mais recente do servidor...`,
      type: "info",
    });

    // Executar o download do servidor atualizado
    const filePath = await downloadServer({ urlDownload, recentVersion });

    // Extrair os arquivos do servidor
    extract({ serverDir: SERVER_DIR, filePath });

    debugger;
  } catch (error) {
    logger({
      context: "APP",
      message: `Erro ao executar a rotina de atualização do servidor: ${error}`,
      type: "error",
    });
  }
}
