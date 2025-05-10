import fs from "fs";
import path from "path";

import { SERVER_DIR } from "../helpers/paths";

// Validar se o servidor existe
interface iReturn {
  exists: boolean;
  world: boolean;
  version: string;
}

export default function (): iReturn {
  // Montar o caminho do servidor
  const serverPath = path.join(SERVER_DIR, "bedrock_server.exe");
  const worldPath = path.join(SERVER_DIR, "worlds");

  // Verificar se o servidor existe
  if (!fs.existsSync(serverPath)) {
    return {
      exists: false,
      world: false,
      version: "",
    };
  } else if (!fs.existsSync(worldPath)) {
    return {
      exists: true,
      world: false,
      version: "",
    };
  } else {
    // Verificar a versão do servidor

    return {
      exists: true,
      world: true,
      version: "1.20.30",
    };
  }
}
