import fs from "fs";

import { SERVER_DIR } from "./helpers/paths";
import { ServerManager } from "./server/serverManager";
import server from "./validations/server";
import recentServer from "./validations/recentServer";
import createBackupWorlds from "./backup/create";
import downloadServer from "./download";
import cleanServerDir from "./server/cleanServerDir";
import copyBackupWorlds from "./backup/copy";
import extract from "./download/extract";
import { logger } from "./helpers/logger";

export default async function updateMinecraftServer() {
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

    ServerManager.setUpdating(true);

    // Parar o servidor
    if (ServerManager.getRunning()) await ServerManager.stop();

    // Instalar a versão mais recente do servidor
    const filePath = await downloadServer({ urlDownload, recentVersion });

    // Criar backup do servidor atual
    if (worldPath) await createBackupWorlds(worldPath);

    // Deletar o servidor atual
    cleanServerDir(SERVER_DIR);

    // Extrair os arquivos do servidor
    extract({ serverDir: SERVER_DIR, filePath });

    // Copiar os arquivos do servidor para o diretório do servidor atualizado
    if (worldPath) await copyBackupWorlds(worldPath);

    logger({
      context: "APP",
      message: `Servidor atualizado para a versão mais recente: ${recentVersion}`,
      type: "success",
    });

    // Atualizar estado de execução do servidor
    ServerManager.setUpdating(true);

    // Atualizar version de server.json
    ServerManager.updateVersion(recentVersion);

    // Iniciar o servidor
    await ServerManager.start();
  } catch (error) {
    logger({
      context: "APP",
      message: `Erro: ${
        error instanceof Error ? error.message : String(error)
      }`,
      type: "error",
    });
  }
}
