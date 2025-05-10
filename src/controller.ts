import { SERVER_DIR } from "./helpers/paths";

import server from "./validations/server";
import recentServer from "./validations/recentServer";
import createBackup from "./backup/create";

import downloadServer from "./download";
import extract from "./download/extract";
import cleanServerDir from "./server/cleanServerDir";
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
    }

    // Instalar a versão mais recente do servidor
    const filePath = await downloadServer({ urlDownload, recentVersion });

    // Criar backup do servidor atual
    if (worldPath) await createBackup(worldPath);

    // Deletar o servidor atual
    cleanServerDir(SERVER_DIR);

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
