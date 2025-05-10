import server from "./validations/server";

export default function controllerServer() {
  const { exists, world, version } = server();
}
