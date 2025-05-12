import { spawn } from "child_process";
import { readFileSync } from "fs";
import SystemInfo from "../helpers/system";
import { SERVER_DIR } from "../helpers/paths";

const { systemType } = SystemInfo.getInstance();

interface ItemCommand {
  player: string;
  item: string;
  amount: number;
}

export class MinecraftCommands {
  private serverPath: string;

  constructor() {
    this.serverPath = SERVER_DIR;
  }

  // Método para enviar comando para o servidor
  private sendCommand(command: string): void {
    if (systemType === "Linux") {
      spawn(
        "screen",
        ["-S", "bedrock", "-X", "stuff", `${command}$(printf \\r)`],
        {
          cwd: this.serverPath,
          shell: true,
        }
      );
    } else if (systemType === "Windows") {
      spawn("powershell.exe", [
        "-Command",
        `Start-Process -FilePath "bedrock_server.exe" -WorkingDirectory "${this.serverPath}" -ArgumentList "${command}"`,
      ]);
    } else {
      throw new Error("Sistema operacional não suportado.");
    }
  }

  // Comando para dar um item a um jogador
  giveItemToPlayer(itemCommand: ItemCommand): void {
    const { player, item, amount } = itemCommand;
    const command = `give ${player} ${item} ${amount}`;
    this.sendCommand(command);
    console.log(`Dando ${amount} de ${item} ao jogador ${player}.`);
  }

  // Comando para mudar o clima
  changeWeather(weather: "clear" | "rain" | "thunder"): void {
    const command = `weather ${weather}`;
    this.sendCommand(command);
    console.log(`Mudando clima para ${weather}.`);
  }

  // Comando para mudar para o dia
  setTimeToDay(): void {
    const command = `time set day`;
    this.sendCommand(command);
    console.log("Mudando o tempo para dia.");
  }

  // Carregar configurações de jogadores de um arquivo JSON
  loadPlayersFromJson(filePath: string): any {
    try {
      const data = readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Erro ao carregar o arquivo JSON:", err);
      return [];
    }
  }
}
