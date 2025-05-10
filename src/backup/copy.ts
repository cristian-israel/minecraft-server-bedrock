import path from "path";
import moment from "moment";
import fsExtra from "fs-extra";

import { BACKUP_DIR } from "../helpers/paths";
import { logger } from "../helpers/logger";

export default async function copyBackupWorlds(
  destinationDirectory: string
): Promise<void> {
  try {
    await fsExtra.copy(path.join(BACKUP_DIR, "worlds"), destinationDirectory);
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
