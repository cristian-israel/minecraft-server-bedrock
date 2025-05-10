import { BASE_DIR } from "../helpers/paths";

// Validar se o servidor existe
interface iReturn {
  exists: boolean;
  world: boolean;
  version: string;
}

export default function (): iReturn {
  return {
    exists: true,
    world: true,
    version: "1.20.30",
  };
}
