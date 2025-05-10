import fs from "fs";
import path from "path";

import { SERVER_DIR } from "../helpers/paths";
import { getDownloadLink } from "../download/getDownloadLink";
import { backupServer } from "../backup/backup";
import { downloadServer } from "../download/downloadServer";
import { extractServer } from "../download/extract";
import { restartServer } from "../server/server";

// Função principal
export default async function () {
  try {
    console.log("[INÍCIO] Verificando o servidor...");

    const { url, versionMatch } = await getDownloadLink();
    console.log("[VERIFICAÇÃO] Link de download obtido:", url);

    // Verifica se o servidor já está instalado
    if (!fs.existsSync(path.join(SERVER_DIR, "bedrock_server.exe"))) {
      // Salvar o arquivo de versão
      fs.writeFileSync(
        path.join(__dirname, "..", "README.md"),
        String(versionMatch),
        "utf-8"
      );

      console.log("[INSTALAÇÃO] Servidor não encontrado. Instalando...");
    } else {
      // Verifica se o servidor está atualizado
      const currentVersion = fs
        .readFileSync(path.join(__dirname, "..", "README.md"), "utf-8")
        .trim();

      if (currentVersion === versionMatch) {
        console.log("[ATUALIZAÇÃO] Servidor já está atualizado.");
        return;
      }

      // Se o servidor já está instalado, mas não está atualizado
      console.log(
        "[ATUALIZAÇÃO] Servidor encontrado, mas não está atualizado, atualizando..."
      );

      // Salvar o arquivo de versão
      fs.writeFileSync(
        path.join(__dirname, "..", "README.md"),
        String(versionMatch),
        "utf-8"
      );

      await backupServer(); // Fazendo backup do mundo
    }

    // Baixando o arquivo
    const filePath = await downloadServer({ url, versionMatch });

    await extractServer(filePath, SERVER_DIR); // Extrair o arquivo
    // restartServer(); // Reinicia o servidor após atualização
  } catch (error: any) {
    console.error("[ERRO] " + error.message);
  }
}
