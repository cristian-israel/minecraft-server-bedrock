import fs from "fs";
import path from "path";

import { SERVER_DIR } from "../helpers/paths";
import { version } from "../config/server.json";
import { logger } from "../helpers/logger";

interface iReturn {
  serverPath?: string;
  worldPath?: string;
  version?: string;
}

export default function validateServer(): iReturn {
  const serverPath = path.join(SERVER_DIR, "bedrock_server.exe");
  const worldPath = path.join(SERVER_DIR, "worlds");

  const serverExists = fs.existsSync(serverPath);
  const worldExists = fs.existsSync(worldPath);

  if (!serverExists) {
    logger({
      context: "VALIDATION",
      message: `Servidor não encontrado no caminho ${serverPath}`,
      type: "error",
    });
    return {};
  }

  if (!worldExists) {
    logger({
      context: "VALIDATION",
      message: `Mundo não encontrado no caminho ${worldPath}`,
      type: "error",
    });
    return { serverPath };
  }

  return {
    serverPath,
    worldPath,
    version: version || undefined,
  };
}
