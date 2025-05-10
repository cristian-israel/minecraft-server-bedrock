import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import net from "net";
import path from "path";

import { logger } from "../helpers/logger";
import { SERVER_DIR } from "../helpers/paths";
import SystemInfo from "../helpers/system";

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

    const PORT = 19132;

    const portInUse = await isPortInUse(PORT);
    if (portInUse) {
      logger({
        context: "SERVER",
        message: `Porta ${PORT} já está em uso. Tentando liberar...`,
        type: "warning",
      });

      await killPortProcess(PORT);

      const stillInUse = await isPortInUse(PORT);
      if (stillInUse) {
        logger({
          context: "SERVER",
          message: `Não foi possível liberar a porta ${PORT}.`,
          type: "error",
        });
        return;
      }

      logger({
        context: "SERVER",
        message: `Porta ${PORT} liberada com sucesso.`,
        type: "success",
      });
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

function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", () => resolve(true))
      .once("listening", () => {
        tester.close();
        resolve(false);
      })
      .listen(port);
  });
}

async function killPortProcess(port: number) {
  if (systemType === "Windows") {
    const command = spawn("powershell.exe", [
      "-Command",
      `
        $port = ${port};
        $p = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue;
        if ($p) {
          $pid = $p.OwningProcess;
          Stop-Process -Id $pid -Force;
        }
      `,
    ]);

    return new Promise<void>((resolve) => {
      command.on("close", () => resolve());
    });
  } else {
    const killer = spawn("fuser", ["-k", `${port}/udp`]);
    return new Promise<void>((resolve) => {
      killer.on("close", () => resolve());
    });
  }
}
