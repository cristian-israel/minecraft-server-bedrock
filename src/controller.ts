import { logger } from "./helpers/logger";
import server from "./validations/server";

export default function controllerServer() {
  // const { exists, world, version } = server();
  const projectRoot = process.cwd(); // retorna o diretório onde o Node iniciou o script

  logger({
    context: "SERVER",
    message: projectRoot,
    type: "success",
  });
}
