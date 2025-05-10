import { spawn } from "child_process";
import os from "os";

export class ServerManager {
  private osType: "Linux" | "Windows";
  private sessionName: string;
  private serverPath: string;

  constructor(sessionName: string, serverPath: string) {
    this.osType = os.platform() === "win32" ? "Windows" : "Linux";
    this.sessionName = sessionName;
    this.serverPath = serverPath;
  }

  async start(): Promise<void> {
    if (this.osType === "Linux") {
      spawn("screen", ["-dmS", this.sessionName, "./bedrock_server"], {
        cwd: this.serverPath,
        shell: true,
        detached: true,
      });
    } else if (this.osType === "Windows") {
      spawn("powershell.exe", [
        "-Command",
        `
          Start-Process -FilePath "bedrock_server.exe" -WorkingDirectory "${this.serverPath}"
        `,
      ], { shell: true });
    } else {
      throw new Error("Sistema não suportado");
    }
  }

  async stop(): Promise<void> {
    if (this.osType === "Linux") {
      spawn("screen", [
        "-S",
        this.sessionName,
        "-X",
        "stuff",
        "stop$(printf \\r)",
      ], { shell: true });
    } else if (this.osType === "Windows") {
      // Aqui, idealmente você salva o PID e dá Stop-Process no PID.
      throw new Error("Implementar parada segura no Windows");
    }
  }

  async isRunning(): Promise<boolean> {
    if (this.osType === "Linux") {
      return new Promise((resolve) => {
        const proc = spawn("screen", ["-ls"], { shell: true });
        let output = "";
        proc.stdout.on("data", (data) => output += data.toString());
        proc.on("close", () => {
          resolve(output.includes(this.sessionName));
        });
      });
    }

    // Para Windows, você precisará verificar se o processo está rodando por PID ou nome.
    return false;
  }
}
