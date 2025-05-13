import { platform } from "os";
import { chmodSync } from "fs";
import { join } from "path";
import { SERVER_DIR } from "./paths";
import { logger } from "./logger";

export type SystemTypes = "Windows" | "Linux";

class SystemInfo {
  private static instance: SystemInfo;
  private readonly osType: SystemTypes;

  private constructor() {
    const rawPlatform = platform();
    this.osType = rawPlatform === "win32" ? "Windows" : "Linux";
  }

  public static getInstance(): SystemInfo {
    if (!SystemInfo.instance) {
      SystemInfo.instance = new SystemInfo();
    }
    return SystemInfo.instance;
  }

  public async validatePermissions(): Promise<void> {
    if (this.systemType === "Linux") {
      try {
        chmodSync(join(SERVER_DIR, "bedrock_server"), 0o755);
        logger({
          context: "PERMISSIONS",
          message: "Permissões de execução aplicadas ao bedrock_server.",
          type: "info",
        });
      } catch (err) {
        logger({
          context: "PERMISSIONS",
          message: `Erro ao aplicar permissão: ${err}`,
          type: "error",
        });
        process.exit(1);
      }
    }
  }

  public get systemType(): SystemTypes {
    return this.osType;
  }

  public get minecraftResponseVersionRegex(): RegExp {
    if (this.osType === "Windows") {
      return /https:\/\/www\.minecraft\.net\/bedrockdedicatedserver\/bin-win\/bedrock-server-(.*?)\.zip/g;
    } else if (this.osType === "Linux") {
      return /https:\/\/www\.minecraft\.net\/bedrockdedicatedserver\/bin-linux\/bedrock-server-(.*?)\.zip/g;
    } else {
      throw new Error("Sistema operacional não suportado.");
    }
  }
}

export default SystemInfo;
