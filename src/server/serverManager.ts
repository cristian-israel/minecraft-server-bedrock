import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { join } from "path";
import SystemInfo from "../helpers/system";
import { SERVER_DIR } from "../helpers/paths";

const { systemType } = SystemInfo.getInstance();

export class ServerManager {
  private serverPath: string;
  private process: ChildProcessWithoutNullStreams | null = null;

  constructor() {
    this.serverPath = SERVER_DIR;
  }

  start(): void {
    if (systemType === "Windows") {
      this.process = spawn(join(this.serverPath, "bedrock_server.exe"), [], {
        cwd: this.serverPath,
        windowsHide: true,
      });

      this.process.stdout.on("data", (data) => {
        console.log(`[BEDROCK] ${data.toString()}`);
      });

      this.process.stderr.on("data", (data) => {
        console.error(`[BEDROCK ERROR] ${data.toString()}`);
      });

      this.process.on("exit", (code) => {
        console.log(`Servidor encerrado com código ${code}`);
        this.process = null;
      });

      console.log("Servidor Minecraft iniciado em background.");
    } else {
      // Linux: screen ou tmux
      spawn("screen", ["-dmS", "bedrock", "./bedrock_server"], {
        cwd: this.serverPath,
        shell: true,
        detached: true,
      });
      console.log("Servidor Minecraft iniciado em modo screen.");
    }
  }

  sendCommand(command: string): void {
    if (systemType === "Windows" && this.process) {
      this.process.stdin.write(command + "\n");
    } else {
      throw new Error("Comando só disponível para instância ativa no Windows.");
    }
  }

  stop(): void {
    if (this.process) {
      this.sendCommand("stop");
    }
  }
}
