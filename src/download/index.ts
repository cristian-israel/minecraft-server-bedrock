import fs from "fs";
import path from "path";
import axios from "axios";
import { finished } from "stream/promises";

import { CACHCE_DIR } from "../helpers/paths";
import { logger } from "../helpers/logger";

interface iProps {
  urlDownload: string;
  recentVersion: string | null;
}

export default async function ({
  urlDownload,
  recentVersion,
}: iProps): Promise<string> {
  try {
    const filePath = path.join(CACHCE_DIR, `server-${recentVersion}.zip`);

    // Verifica se o arquivo já existe
    if (fs.existsSync(filePath)) {
      logger({
        context: "DOWNLOAD",
        message:
          "Arquivo do servidor já existe, não é necessário baixar novamente",
        type: "info",
      });

      return filePath;
    }

    logger({
      context: "DOWNLOAD",
      message: `Baixando a versão mais recente do servidor`,
      type: "info",
    });

    const writer = fs.createWriteStream(filePath);

    // Executa o download do arquivo
    const response = await axios({
      url: urlDownload,
      method: "GET",
      responseType: "stream",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "*/*",
        Connection: "keep-alive",
      },
      timeout: 15000,
    });

    // Verifica se a resposta é bem-sucedida
    response.data.pipe(writer);

    // Aguarda o término do stream corretamente
    await finished(writer);

    logger({
      context: "DOWNLOAD",
      message: "Download concluído com sucesso",
      type: "success",
    });

    return filePath;
  } catch (error) {
    throw new Error(`Erro ao executar download do servidor: ${error}`);
  }
}
