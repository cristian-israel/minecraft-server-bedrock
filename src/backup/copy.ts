import path from "path";
import fsExtra from "fs-extra";

import { BACKUP_DIR } from "../helpers/paths";
import { logger } from "../helpers/logger";

export default async function copyBackupWorlds(
  worldPath: string
): Promise<void> {
  try {
    await fsExtra.copy(path.join(BACKUP_DIR, "worlds"), worldPath);

    logger({
      context: "BACKUP",
      message: `Backup de mundos copiado com sucesso`,
      type: "success",
    });
  } catch (error) {
    throw new Error(`Erro ao copiar o backup de mundos: ${error}`);
  }
}
