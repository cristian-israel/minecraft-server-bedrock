import { spawn } from "child_process";
import path from "path";

let serverProcess: ReturnType<typeof spawn> | null = null;

export function startServer(executablePath: string) {
  if (serverProcess) {
    console.log("Servidor já está em execução.");
    return;
  }

  serverProcess = spawn(executablePath, [], {
    cwd: path.dirname(executablePath),
    detached: true,
    stdio: "inherit",
  });

  serverProcess.on("exit", (code) => {
    console.log(`Servidor encerrado com código: ${code}`);
    serverProcess = null;
  });

  console.log("Servidor iniciado.");
}

export function stopServer() {
  if (serverProcess) {
    process.kill(-serverProcess.pid); // Mata o processo pai e subprocessos
    serverProcess = null;
    console.log("Servidor parado.");
  } else {
    console.log("Servidor não está em execução.");
  }
}
