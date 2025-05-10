import fs from "fs";
import path from "path";

// Caminhos absolutos para os diretórios do projeto
export const PROJECT_DIR = process.cwd();

// Local onde os arquivos de download serão armazenados
export const CACHCE_DIR = path.join(PROJECT_DIR, ".cache");
if (!fs.existsSync(CACHCE_DIR)) {
  fs.mkdirSync(CACHCE_DIR);
}

// Local onde o servidor será instalado e executado
export const SERVER_DIR = path.join(PROJECT_DIR, "minecraftServer");
if (!fs.existsSync(SERVER_DIR)) {
  fs.mkdirSync(SERVER_DIR);
}

// Local onde os arquivos de backup do servidor serão armazenados
export const BACKUP_DIR = path.join(PROJECT_DIR, "minecraftServerBackups");
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}
