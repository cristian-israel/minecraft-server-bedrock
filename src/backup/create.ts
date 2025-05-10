import path from "path";
import fsExtra from "fs-extra";

import { BACKUP_DIR } from "../helpers/paths";
import { logger } from "../helpers/logger";

export default async function createBackupWorlds(
  worldPath: string
): Promise<void> {
  logger({
    context: "BACKUP",
    message: `Realizando backup de mundos do servidor`,
    type: "info",
  });

  try {
    await fsExtra.copy(worldPath, path.join(BACKUP_DIR, "worlds"));
    logger({
      context: "BACKUP",
      message: `Backup de mundos do servidor criado com sucesso`,
      type: "success",
    });
  } catch (error) {
    throw new Error(`Erro ao criar o backup de mundos do servidor: ${error}`);
  }
}
