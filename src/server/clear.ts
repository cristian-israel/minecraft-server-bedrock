import fs from "fs";

export default function (SERVER_DIR: string): void {
  fs.unlinkSync(SERVER_DIR); // Limpa o diretório do servidor
  fs.mkdirSync(SERVER_DIR, { recursive: true }); // Cria o diretório do servidor
}
