import path from "path";

// Caminhos absolutos para os diretórios do projeto
export const PREJECT_DIR = process.cwd();
export const CACHCE_DIR = path.join(PREJECT_DIR, "cache");

// Caminhos absolutos para os diretórios do servidor
export const SERVER_DIR = path.join(PREJECT_DIR, "minecraftServer");
export const BACKUP_DIR = path.join(PREJECT_DIR, "minecraftServerBackups");
