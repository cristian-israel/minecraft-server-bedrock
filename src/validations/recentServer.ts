import axios from "axios";
import SystemInfo from "../helpers/system";

const MINECRAFT_URL = "https://www.minecraft.net/pt-br/download/server/bedrock";

interface DownloadLink {
  urlDownload: string;
  recentVersion: string;
}

const { minecraftResponseVersionRegex } = SystemInfo.getInstance();

export default async function (): Promise<DownloadLink> {
  try {
    const { data } = await axios.get(MINECRAFT_URL, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const match = minecraftResponseVersionRegex.exec(data);

    if (!match || !match[0] || !match[1]) {
      throw new Error("Link de download ou versão não encontrado.");
    }

    return {
      urlDownload: match[0],
      recentVersion: match[1],
    };
  } catch (error) {
    throw new Error(`Erro ao buscar o link de download: ${error}`);
  }
}
