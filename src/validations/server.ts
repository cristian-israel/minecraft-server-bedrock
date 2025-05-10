import fs from "fs";
import path from "path";

import { SERVER_DIR } from "../helpers/paths";
import { version } from "../config/server.json";
import { logger } from "../helpers/logger";

// Validar se o servidor existe
interface iReturn {
  serverPath: string;
  worldPath?: string;
  version?: string;
}

export default function (): iReturn {
  // Montar o caminho do servidor
  const serverPath = path.join(SERVER_DIR, "bedrock_server.exe");
  const worldPath = path.join(SERVER_DIR, "worlds");

  // Verificar se o servidor existe
  if (!fs.existsSync(serverPath)) {
    logger({
      context: "VALIDATION",
      message: `Servidor não encontrado no caminho ${serverPath}`,
      type: "error",
    });

    return {
      serverPath,
      worldPath: undefined,
      version: undefined,
    };

    // Verificar se o mundo existe
  } else if (!fs.existsSync(worldPath)) {
    logger({
      context: "VALIDATION",
      message: `Mundo não encontrado no caminho ${worldPath}`,
      type: "error",
    });

    return {
      serverPath: serverPath,
      worldPath: undefined,
      version: undefined,
    };
  } else {
    return {
      serverPath,
      worldPath,
      version: version ? version : undefined,
    };
  }
}
