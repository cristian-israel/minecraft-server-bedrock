import fs from "fs";
import path from "path";
import moment from "moment";
import fsExtra from "fs-extra";

import { BACKUP_DIR, SERVER_DIR } from "../helpers/paths";

export async function backupServer(): Promise<void> {
  // Verifica se o diretório de mundo existe, se não existir retorna log
  if (!fs.existsSync(path.join(SERVER_DIR, "worlds"))) {
    console.log("[BACKUP] Diretório de mundos não encontrado.");
    deleteServer();
    return;
  }

  deleteServer();

  const timestamp = moment().format("YYYY-MM-DD_HH-mm-ss");
  const backupDir = path.join(BACKUP_DIR, `worlds-${timestamp}`);

  // Verifica se o diretório de backup existe, se não existir, cria
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  try {
    await fsExtra.copy(path.join(SERVER_DIR, "worlds"), backupDir);
    console.log("[BACKUP] Backup realizado com sucesso!");
  } catch (error: any) {
    console.error(`[BACKUP] Erro ao fazer backup: ${error.message}`);
    throw new Error("Erro ao fazer backup");
  }
}

function deleteServer() {
  // Verifica se o diretório do servidor existe
  if (fs.existsSync(SERVER_DIR)) {
    fsExtra.removeSync(SERVER_DIR);
    console.log("[EXTRAÇÃO] Servidor removido com sucesso!");
  } else {
    console.log("[EXTRAÇÃO] Diretório do servidor não encontrado.");
  }
}
