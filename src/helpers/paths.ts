import path from "path";

// Caminhos
export const CACHCE_DIR = path.join(__dirname, "..", "cache");
export const BASE_DIR = path.resolve(path.dirname(__dirname));
export const SERVER_DIR = path.join(BASE_DIR, "server");
export const BACKUP_DIR = path.join(BASE_DIR, "backups");

// URL de onde o servidor Bedrock será baixado
export const MINECRAFT_URL =
  "https://www.minecraft.net/pt-br/download/server/bedrock";
export const MINECRAFT_DOWNLOAD_URL =
  "https://www.minecraft.net/bedrockdedicatedserver/bin-linux/bedrock-server-";
