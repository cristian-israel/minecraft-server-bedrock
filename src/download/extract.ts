import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { logger } from "../helpers/logger";

interface ExtractProps {
  filePath: string;
  serverDir: string;
}

export default function extractZip({
  filePath,
  serverDir,
}: ExtractProps): void {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo ZIP não encontrado: ${filePath}`);
    }

    const zip = new AdmZip(filePath);
    zip.extractAllTo(serverDir, true);

    logger({
      context: "DOWNLOAD",
      message: `Servidor extraído com sucesso`,
      type: "success",
    });

    // Remover arquivo ZIP
    fs.unlinkSync(filePath);
    logger({
      context: "DOWNLOAD",
      message: `Arquivo ${path.basename(filePath)} removido após extração`,
      type: "info",
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger({
      context: "DOWNLOAD",
      message: `Erro ao extrair o servidor: ${errMsg}`,
      type: "error",
    });
    throw error;
  }
}
