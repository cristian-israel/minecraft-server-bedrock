// src/server/serverManager.ts
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { join } from "path";
import SystemInfo from "../helpers/system";
import { SERVER_DIR } from "../helpers/paths";

const { systemType } = SystemInfo.getInstance();

let process: ChildProcessWithoutNullStreams | null = null;

export const ServerManager = {
  start() {
    if (systemType === "Windows") {
      process = spawn(join(SERVER_DIR, "bedrock_server.exe"), [], {
        cwd: SERVER_DIR,
        windowsHide: true,
      });

      process.stdout.on("data", (data) => {
        console.log(`[BEDROCK] ${data.toString()}`);
      });

      process.stderr.on("data", (data) => {
        console.error(`[BEDROCK ERROR] ${data.toString()}`);
      });

      process.on("exit", (code) => {
        console.log(`Servidor encerrado com código ${code}`);
        process = null;
      });

      console.log("Servidor Minecraft iniciado em background.");
    } else {
      spawn("screen", ["-dmS", "bedrock", "./bedrock_server"], {
        cwd: SERVER_DIR,
        shell: true,
        detached: true,
      });
      console.log("Servidor Minecraft iniciado em modo screen.");
    }
  },

  sendCommand(command: string) {
    if (systemType === "Windows" && process) {
      process.stdin.write(command + "\n");
    } else {
      throw new Error("Comando só disponível para instância ativa no Windows.");
    }
  },

  stop() {
    if (process) {
      this.sendCommand("stop");
    }
  },

  isRunning() {
    return !!process;
  }
};
