import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

export async function extractServer(filePath: string, serverDir: string): Promise<void> {
  try {
    const zip = new AdmZip(filePath);
    zip.extractAllTo(serverDir, true);
    console.log("[EXTRAÇÃO] Atualização concluída.");
    fs.unlinkSync(filePath); // Remove o .zip após extrair
  } catch (err: any) {
    console.error("Erro ao extrair o arquivo:", err.message);
    throw err;
  }
}
