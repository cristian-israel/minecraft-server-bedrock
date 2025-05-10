import fs from "fs";
import path from "path";

// Caminhos absolutos para os diretórios do projeto
export const PROJECT_DIR = process.cwd();
export const CACHCE_DIR = path.join(PROJECT_DIR, "cache");
if (!fs.existsSync(CACHCE_DIR)) {
  fs.mkdirSync(CACHCE_DIR);
}

// Caminhos absolutos para os diretórios do servidor
export const SERVER_DIR = path.join(PROJECT_DIR, "minecraftServer");
export const BACKUP_DIR = path.join(PROJECT_DIR, "minecraftServerBackups");
