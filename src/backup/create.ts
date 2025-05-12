import path from "path";
import fsExtra from "fs-extra";

import { CACHE_DIR } from "../helpers/paths";
import { logger } from "../helpers/logger";

export default async function createBackupWorlds(
  worldPath: string
): Promise<void> {
  try {
    await fsExtra.copy(worldPath, path.join(CACHE_DIR, "worlds"));

    logger({
      context: "BACKUP",
      message: `Backup de mundos criado com sucesso`,
      type: "success",
    });
  } catch (error) {
    throw new Error(`Erro ao criar o backup de mundos : ${error}`);
  }
}
