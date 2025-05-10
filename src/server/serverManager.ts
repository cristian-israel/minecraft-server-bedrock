import SystemInfo from "../helpers/system";
import { SERVER_DIR } from "../helpers/paths";
import { logger } from "../helpers/logger";

const { systemType } = SystemInfo.getInstance();

export const serverManager = {
  start: async function () {},

  stop: function () {},

  restart: function () {},

  isRunning: function () {},
};
