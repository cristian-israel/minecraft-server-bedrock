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
      message: `Servidor extraído com sucesso`,
      type: "success",
    });

    // Remove o .zip após extrair
    fs.unlinkSync(filePath);
  } catch (err: any) {
    throw err;
  }
}
