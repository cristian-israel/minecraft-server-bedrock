import { spawn } from "child_process";

import SystemInfo from "../helpers/system";
import { SERVER_DIR } from "../helpers/paths";

const { systemType } = SystemInfo.getInstance();

export class ServerManager {
  private sessionName: string;
  private serverPath: string;

  constructor(sessionName: string) {
    this.sessionName = sessionName;
    this.serverPath = SERVER_DIR;
  }

  async start(): Promise<void> {
    if (systemType === "Linux") {
      spawn("screen", ["-dmS", this.sessionName, "./bedrock_server"], {
        cwd: this.serverPath,
        shell: true,
        detached: true,
      });
    } else if (systemType === "Windows") {
      spawn(
        "powershell.exe",
        [
          "-Command",
          `
          Start-Process -FilePath "bedrock_server.exe" -WorkingDirectory "${this.serverPath}"
        `,
        ],
        { shell: true }
      );
    } else {
      throw new Error("Sistema não suportado");
    }
  }

  async stop(): Promise<void> {
    if (systemType === "Linux") {
      spawn(
        "screen",
        ["-S", this.sessionName, "-X", "stuff", "stop$(printf \\r)"],
        { shell: true }
      );
    } else if (systemType === "Windows") {
      // Aqui, idealmente você salva o PID e dá Stop-Process no PID.
      throw new Error("Implementar parada segura no Windows");
    }
  }

  async isRunning(): Promise<boolean> {
    if (systemType === "Linux") {
      return new Promise((resolve) => {
        const proc = spawn("screen", ["-ls"], { shell: true });
        let output = "";
        proc.stdout.on("data", (data) => (output += data.toString()));
        proc.on("close", () => {
          resolve(output.includes(this.sessionName));
        });
      });
    }

    // Para Windows, você precisará verificar se o processo está rodando por PID ou nome.
    return false;
  }
}
