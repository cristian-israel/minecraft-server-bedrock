import fs from "fs";
import path from "path";
import axios from "axios";
import { CACHCE_DIR } from "../helpers/paths";
import { finished } from "stream/promises";

interface iProps {
  url: string;
  versionMatch: string | null;
}

export async function downloadServer({
  url,
  versionMatch,
}: iProps): Promise<string> {
  try {
    const filePath = path.join(CACHCE_DIR, `server-${versionMatch}.zip`);
    const writer = fs.createWriteStream(filePath);
    const response = await axios({
      url,
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

    response.data.pipe(writer);

    // Aguarda o término do stream corretamente
    await finished(writer);

    return filePath;

    console.log("[DOWNLOAD] Arquivo baixado com sucesso.");
  } catch (error: any) {
    throw new Error(`Erro ao executar download do servidor: ${error.message}`);
  }
}
