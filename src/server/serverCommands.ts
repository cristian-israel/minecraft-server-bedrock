import { ServerManager } from "./serverManager";

export const MinecraftCommands = {
  // Altera o horário do jogo
  setTime(time: "day" | "night" | "noon" | "midnight" | number) {
    const value = typeof time === "number" ? time : time;
    ServerManager.sendCommand(`time set ${value}`);
  },

  // Altera o clima
  setWeather(weather: "clear" | "rain" | "thunder") {
    ServerManager.sendCommand(`weather ${weather}`);
  },

  // Dá um item para um jogador
  giveItem(player: string, item: string, amount: number = 1) {
    if (!player || !item) {
      throw new Error("Jogador e item são obrigatórios.");
    }

    ServerManager.sendCommand(`give "${player}" ${item} ${amount}`);
  },

  // Define o modo de jogo de um jogador
  setGamemode(
    mode: "survival" | "creative" | "adventure" | "spectator",
    player: string
  ) {
    ServerManager.sendCommand(`gamemode ${mode} "${player}"`);
  },
};
