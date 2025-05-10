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

  public get type(): "Windows" | "Linux" {
    return this.osType;
  }
}

// Uso:
// const system = SystemInfo.getInstance().type;

export default SystemInfo;
