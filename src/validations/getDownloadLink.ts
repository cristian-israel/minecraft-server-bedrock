import axios from "axios";
import { MINECRAFT_URL } from "../helpers/paths";

interface DownloadLink {
  url: string;
  versionMatch: string;
}

export async function getDownloadLink(): Promise<DownloadLink> {
  try {
    const { data } = await axios.get(MINECRAFT_URL, {
      timeout: 10000, // Timeout de 10 segundos
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // Regex para capturar o link do servidor Bedrock
    const regex =
      /https:\/\/www\.minecraft\.net\/bedrockdedicatedserver\/bin-win\/bedrock-server-.*?\.zip/g;
    const match = data.match(regex);

    if (match && match.length > 0) {
      // Extraindo a versão a partir do nome do arquivo
      const versionMatch = match[0].match(/bedrock-server-(.*?)\.zip/)[1];
      if (versionMatch && versionMatch) {
        console.log(`[DOWNLOAD] Versão encontrada: ${versionMatch}`);
      } else {
        throw "[DOWNLOAD] Não foi possível extrair a versão.";
      }

      return { url: match[0], versionMatch };
    } else {
      throw new Error("Link de download não encontrado.");
    }
  } catch (error: any) {
    throw new Error(`Erro ao buscar o link de download: ${error.message}`);
  }
}
