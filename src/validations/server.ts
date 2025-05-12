import fs from "fs";
import path from "path";

import { SERVER_DIR } from "../helpers/paths";
import { logger } from "../helpers/logger";
import { ServerManager } from "../server/serverManager";
import SystemInfo from "../helpers/system";

const { systemType } = SystemInfo.getInstance();

interface iReturn {
  worldPath?: string;
  version?: string;
}

export default function validateServer(): iReturn {
  const serverPath = path.join(SERVER_DIR, systemType === "Windows" ? "bedrock_server.exe" : "bedrock_server");
  const worldPath = path.join(SERVER_DIR, "worlds");

  const serverExists = fs.existsSync(serverPath);
  const worldExists = fs.existsSync(worldPath);

  if (!serverExists) {
    logger({
      context: "VALIDATION",
      message: `Servidor não encontrado`,
      type: "info",
    });

    return {};
  }

  return {
    worldPath: worldExists ? worldPath : undefined,
    version: ServerManager.getVersion().version
  };
}
