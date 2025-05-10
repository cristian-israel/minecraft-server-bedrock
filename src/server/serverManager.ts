import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import path from "path";

import SystemInfo from "../helpers/system";
import { SERVER_DIR } from "../helpers/paths";
import { checkPort } from "./commands/windowns";
import { logger } from "../helpers/logger";

let serverProcess: ChildProcessWithoutNullStreams | null = null;

const { systemType } = SystemInfo.getInstance();

const executableName =
  systemType === "Windows" ? "bedrock_server.exe" : "./bedrock_server";

const SERVER_EXECUTABLE_PATH = path.join(SERVER_DIR, executableName);

export const serverManager = {
  start: async function () {
    if (serverProcess) {
      logger({
        context: "SERVER",
        message: "O servidor já está em execução.",
        type: "warning",
      });
      return;
    }

    const PORTS = [19132, 19133];

    for (const port of PORTS) {
      const inUse = await checkPort(port);
      if (inUse) {
        logger({
          context: "SERVER",
          message: `Porta ${port} em uso. Tentando liberar...`,
          type: "warning",
        });
        await killPortProcess(port);
        const stillInUse = await checkPort(port);
        if (stillInUse) {
          logger({
            context: "SERVER",
            message: `Falha ao liberar a porta ${port}.`,
            type: "error",
          });
          return;
        }
        logger({
          context: "SERVER",
          message: `Porta ${port} liberada com sucesso.`,
          type: "success",
        });
      }
    }

    serverProcess = spawn(SERVER_EXECUTABLE_PATH, [], {
      cwd: SERVER_DIR,
      stdio: "inherit",
    }) as ChildProcessWithoutNullStreams;

    serverProcess.on("exit", (code) => {
      logger({
        context: "SERVER",
        message: `Servidor finalizado com código ${code}`,
        type: "info",
      });
      serverProcess = null;
    });

    logger({
      context: "SERVER",
      message: "Servidor iniciado com sucesso.",
      type: "success",
    });
  },

  stop: function () {
    if (!serverProcess) {
      logger({
        context: "SERVER",
        message: "Servidor não está em execução.",
        type: "warning",
      });
      return;
    }

    if (serverProcess.pid === undefined) {
      logger({
        context: "SERVER",
        message: "Erro: PID indefinido.",
        type: "error",
      });
      return;
    }

    try {
      if (systemType === "Windows") {
        const killer = spawn("taskkill", [
          "/PID",
          String(serverProcess.pid),
          "/T",
          "/F",
        ]);
        killer.on("close", () => {
          logger({
            context: "SERVER",
            message: "Servidor interrompido com sucesso.",
            type: "success",
          });
          serverProcess = null;
        });
      } else {
        process.kill(serverProcess.pid);
        logger({
          context: "SERVER",
          message: "Servidor interrompido com sucesso.",
          type: "success",
        });
        serverProcess = null;
      }
    } catch (err: any) {
      logger({
        context: "SERVER",
        message: `Erro ao parar o servidor: ${err.message}`,
        type: "error",
      });
    }
  },

  restart: function () {
    logger({
      context: "SERVER",
      message: "Reiniciando servidor...",
      type: "info",
    });
    this.stop();
    setTimeout(() => this.start(), 3000);
  },

  isRunning: function () {
    return !!serverProcess;
  },
};
