import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import path from "path";
import { logger } from "../helpers/logger";
import { SERVER_DIR } from "../helpers/paths";

let serverProcess: ChildProcessWithoutNullStreams | null = null;

const executableName =
  process.platform === "win32" ? "bedrock_server.exe" : "./bedrock_server";
const SERVER_EXECUTABLE_PATH = path.join(SERVER_DIR, executableName);

export const serverManager = {
  start() {
    if (serverProcess) {
      logger({
        context: "SERVER",
        message: "O servidor já está em execução.",
        type: "warning",
      });
      return;
    }

    serverProcess = spawn(SERVER_EXECUTABLE_PATH, [], {
      cwd: SERVER_DIR,
      detached: true,
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

  stop() {
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
      if (process.platform === "win32") {
        spawn("taskkill", ["/PID", String(serverProcess.pid), "/T", "/F"]);
      } else {
        process.kill(-serverProcess.pid);
      }

      logger({
        context: "SERVER",
        message: "Servidor interrompido com sucesso.",
        type: "success",
      });
      serverProcess = null;
    } catch (err: any) {
      logger({
        context: "SERVER",
        message: `Erro ao parar o servidor: ${err.message}`,
        type: "error",
      });
    }
  },

  restart() {
    logger({
      context: "SERVER",
      message: "Reiniciando servidor...",
      type: "info",
    });
    this.stop();
    setTimeout(() => this.start(), 3000);
  },

  isRunning() {
    return !!serverProcess;
  },
};
