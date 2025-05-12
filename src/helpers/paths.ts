import fs from "fs";
import path from "path";

// Caminhos absolutos para os diretórios do projeto
export const PROJECT_DIR = process.cwd();

// Local onde os arquivos de download serão armazenados
export const CACHE_DIR = path.join(PROJECT_DIR, ".cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

// Local onde o servidor será instalado e executado
export const SERVER_DIR = path.join(PROJECT_DIR, "minecraftServer");
if (!fs.existsSync(SERVER_DIR)) {
  fs.mkdirSync(SERVER_DIR);
}

// Caminho para o arquivo de configuração
export const CONFIG_SERVER_FILE = path.join(
  PROJECT_DIR,
  "src",
  "server",
  "config.json"
);
