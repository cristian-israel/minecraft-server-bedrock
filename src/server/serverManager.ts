import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { createWriteStream, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import moment from "moment";

import SystemInfo from "../helpers/system";
import { SERVER_DIR, CACHE_DIR, CONFIG_SERVER_FILE } from "../helpers/paths";
import { logger } from "../helpers/logger";

const { systemType } = SystemInfo.getInstance();

let process: ChildProcessWithoutNullStreams | null = null;
let isReady = false;
let updating = false;

const logStream = createWriteStream(join(CACHE_DIR, "server.log"), {
  flags: "a",
});

type configServerJson = {
  version: string;
  updateDate: string;
};

// Lista de funções que reagem a cada nova linha do stdout
const stdoutListeners = new Set<(message: string) => void>();

export const ServerManager = {
  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (process) {
        logger({
          context: "SERVER",
          message: "Servidor já está em execução.",
          type: "info",
        });
        return resolve();
      } else if (updating) {
        logger({
          context: "SERVER",
          message: "Servidor está em atualização.",
          type: "info",
        });
        return resolve();
      }

      if (systemType === "Windows") {
        process = spawn(join(SERVER_DIR, "bedrock_server.exe"), [], {
          cwd: SERVER_DIR,
          windowsHide: true,
        });

        process.stdout.on("data", (data) => {
          const message = data.toString().trim();
          logStream.write(`${message}\n`);

          // Detecta servidor pronto
          if (
            !isReady &&
            message.includes(
              "======================================================"
            )
          ) {
            isReady = true;
            logger({
              context: "SERVER",
              message: "Servidor Minecraft está pronto para comandos.",
              type: "info",
            });
            resolve();
          }

          // Notifica ouvintes
          stdoutListeners.forEach((callback) => callback(message));
        });

        process.stderr.on("data", (data) => {
          const message = data.toString();
          logStream.write(`[ERROR] ${message}\n`);
        });

        process.on("exit", () => {
          process = null;
          isReady = false;
        });

        logger({
          context: "SERVER",
          message: "Servidor Minecraft bedrock iniciado.",
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

  sendCommand(command: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!process || !isReady) {
        logger({
          context: "SERVER",
          message: "Servidor não está em execução.",
          type: "info",
        });
        return resolve();
      }

      if (systemType === "Windows" && process) {
        const logCommand = `\n[SERVER] Comando enviado: ${command}\n`;
        logStream.write(logCommand);
        process.stdin.write(command + "\n");
        return resolve();
      } else {
        return reject(
          new Error("Comando não suportado para o sistema operacional atual.")
        );
      }
    });
  },

  stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!process || !isReady) {
        logger({
          context: "SERVER",
          message: "Servidor não está em execução.",
          type: "info",
        });
        return resolve();
      }

      const onMessage = (message: string) => {
        if (message.includes("Quit correctly")) {
          logger({
            context: "SERVER",
            message: "Servidor Minecraft encerrado corretamente.",
            type: "info",
          });

          stdoutListeners.delete(onMessage);
          cleanup();
          resolve();
        }
      };

      const onExit = (code: number) => {
        stdoutListeners.delete(onMessage);
        cleanup();
        resolve();
      };

      const cleanup = () => {
        if (process) {
          process.off("exit", onExit);
        }
        process = null;
        isReady = false;
      };

      stdoutListeners.add(onMessage);
      process.once("exit", onExit);

      this.sendCommand("stop");
    });
  },

  getRunning(): boolean {
    return !!process;
  },

  getUpdating(): boolean {
    return !!updating;
  },

  setUpdating(value: boolean) {
    updating = value;
  },

  getVersion(): configServerJson {
    try {
      const data = JSON.parse(
        readFileSync(CONFIG_SERVER_FILE, "utf-8")
      ) as configServerJson;

      return data;
    } catch (error) {
      logger({
        context: "SERVER",
        message: `Erro ao ler o arquivo de configuração: ${error}`,
        type: "error",
      });

      return { version: "", updateDate: "" };
    }
  },

  updateVersion(newVersion: string) {
    const data: configServerJson = {
      version: newVersion,
      updateDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    writeFileSync(CONFIG_SERVER_FILE, JSON.stringify(data, null, 2));
  },
};
