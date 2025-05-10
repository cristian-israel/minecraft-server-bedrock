import { exec } from "child_process";
import { SERVER_DIR } from "../helpers/paths";

export function restartServer(): void {
  exec(
    `cd ${SERVER_DIR} && ./bedrock_server > server_log.txt 2>&1 &`,
    (error, stderr) => {
      if (error) {
        console.error(`Erro ao reiniciar o servidor: ${stderr}`);
      } else {
        console.log("[REINÍCIO] Servidor reiniciado com sucesso!");
      }
    }
  );
}
