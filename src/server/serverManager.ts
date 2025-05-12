import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { join } from "path";
import { createWriteStream } from "fs"; // Importando o módulo fs
import SystemInfo from "../helpers/system";
import { SERVER_DIR, CACHCE_DIR } from "../helpers/paths";
import { logger } from "../helpers/logger";

const { systemType } = SystemInfo.getInstance();

let process: ChildProcessWithoutNullStreams | null = null;

// Criando um fluxo de escrita para o arquivo de log
const logStream = createWriteStream(join(CACHCE_DIR, "server.log"), {
  flags: "a",
});

export const ServerManager = {
  start() {
    if (process) {
      logger({
        context: "SERVER",
        message: "Servidor já está em execução.",
        type: "info",
      });
      return;
    }

    if (systemType === "Windows") {
      process = spawn(join(SERVER_DIR, "bedrock_server.exe"), [], {
        cwd: SERVER_DIR,
        windowsHide: true,
      });

      // Redirecionando a saída padrão e de erro para o arquivo de log
      process.stdout.on("data", (data) => {
        logStream.write(`${data.toString()}\n`);
      });

      // Redirecionando a saída de erro para o arquivo de log
      process.stderr.on("data", (data) => {
        logStream.write(`${data.toString()}\n`);
      });

      // Tratando o evento de erro
      process.on("exit", (code) => {
        logStream.write(`Servidor encerrado com código ${code}\n`);
        process = null;
      });

      logger({
        context: "SERVER",
        message: "Servidor Minecraft iniciado.",
        type: "success",
      });
    } else if (systemType === "Linux") {
      spawn("screen", ["-dmS", "bedrock", "./bedrock_server"], {
        cwd: SERVER_DIR,
        shell: true,
        detached: true,
      });

      logger({
        context: "SERVER",
        message: "Servidor Minecraft iniciado.",
        type: "success",
      });
    } else {
      throw new Error("Sistema operacional não suportado.");
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
    } else {
      logger({
        context: "SERVER",
        message: "Servidor não está em execução.",
        type: "info",
      });
    }
  },

  isRunning() {
    return !!process;
  },
};
