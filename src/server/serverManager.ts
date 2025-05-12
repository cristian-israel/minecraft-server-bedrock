import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { join } from "path";
import { createWriteStream } from "fs";

import SystemInfo from "../helpers/system";
import { SERVER_DIR, CACHCE_DIR } from "../helpers/paths";
import { logger } from "../helpers/logger";

const { systemType } = SystemInfo.getInstance();

let process: ChildProcessWithoutNullStreams | null = null;
let isReady = false;

// Criando um fluxo de escrita para o arquivo de log
const logStream = createWriteStream(join(CACHCE_DIR, "server.log"), {
  flags: "a",
});

export const ServerManager = {
  // Torna a função start assíncrona
  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (process) {
        logger({
          context: "SERVER",
          message: "Servidor já está em execução.",
          type: "info",
        });
        return resolve(); // O servidor já está em execução, então resolve imediatamente.
      }

      if (systemType === "Windows") {
        process = spawn(join(SERVER_DIR, "bedrock_server.exe"), [], {
          cwd: SERVER_DIR,
          windowsHide: true,
        });

        // Redirecionando a saída padrão e de erro para o arquivo de log
        process.stdout.on("data", (data) => {
          const message = data.toString();
          logStream.write(`${message}\n`);

          // Detecta que o servidor está pronto
          if (!isReady && message.includes("======================================================")) {
            isReady = true;
            logger({
              context: "SERVER",
              message: "Servidor Minecraft está pronto para comandos.",
              type: "info",
            });
            resolve(); // Resolve a Promise quando o servidor estiver pronto
          }
        });

        // Redirecionando a saída de erro para o arquivo de log
        process.stderr.on("data", (data) => {
          const message = data.toString();
          logStream.write(`[ERROR] ${message}\n`);
        });

        // Tratando o evento de erro
        process.on("exit", (code) => {
          logStream.write(`Servidor encerrado com código ${code}\n`);
          process = null;
          isReady = false;
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

        resolve();
      } else {
        reject(new Error("Sistema operacional não suportado."));
      }
    });
  },

  sendCommand(command: string) {
    if (!process || !isReady) {
      throw new Error("Servidor ainda não está pronto para comandos.");
    }

    // Logando o comando enviado
    const logCommand = `[SERVER] Comando enviado: ${command}\n`;
    logStream.write(logCommand);

    // Enviando o comando para o servidor
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
