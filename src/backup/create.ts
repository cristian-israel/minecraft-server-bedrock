import path from "path";
import moment from "moment";
import fsExtra from "fs-extra";

import { BACKUP_DIR } from "../helpers/paths";
import { logger } from "../helpers/logger";

export default async function createBackup(worldPath: string): Promise<void> {
  logger({
    context: "BACKUP",
    message: `Realizando backup do servidor`,
    type: "info",
  });

  const timestamp = moment().format("YYYY-MM-DD_HH-mm-ss");
  const backupDir = path.join(BACKUP_DIR, `worlds-${timestamp}`);

  try {
    await fsExtra.copy(worldPath, backupDir);
    logger({
      context: "BACKUP",
      message: `Backup do servidor criado com sucesso`,
      type: "success",
    });
  } catch (error) {
    logger({
      context: "BACKUP",
      message: `Erro ao criar backup: ${error}`,
      type: "error",
    });

    throw error;
  }
}
