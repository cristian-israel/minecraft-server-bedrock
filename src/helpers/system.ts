import { platform } from "os";

class SystemInfo {
  private static instance: SystemInfo;
  private readonly osType: "Windows" | "Linux";

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

  public get systemType(): "Windows" | "Linux" {
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

// Uso:
// const system = SystemInfo.getInstance().type;

export default SystemInfo;
