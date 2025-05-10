import fs from "fs";
import AdmZip from "adm-zip";
import { logger } from "../helpers/logger";

interface ExtractProps {
  filePath: string;
  serverDir: string;
}

export default function ({ filePath, serverDir }: ExtractProps): void {
  try {
    const zip = new AdmZip(filePath);
    zip.extractAllTo(serverDir, true);

    logger({
      context: "DOWNLOAD",
      message: `Servidor extraído com sucesso para o diretório ${serverDir}`,
      type: "success",
    });

    fs.unlinkSync(filePath); // Remove o .zip após extrair
  } catch (err: any) {
    throw err;
  }
}
