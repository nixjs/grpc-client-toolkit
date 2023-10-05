import { Types, BaseErrors, Interfaces } from "@nixjs23n6/types";
import debug from "debug";
import { HeaderConfigInterface } from "./types";

export class BaseClient {
  serviceClient: any;
  config: HeaderConfigInterface | Types.Object<any>;
  log: debug.Debugger;
  logger?: Interfaces.Logger;
  constructor(config: HeaderConfigInterface, logger?: Interfaces.Logger) {
    if (!config.url) {
      throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
        name: "config.url",
      });
    }
    this.config = config;
    this.logger = logger;
    this.log = debug("");
    debug.formatArgs = function (args) {
      const name = this.namespace;
      args[0] = `${name} ${args[0]}`;
    };
    this.log.enabled = (logger && logger.debug) || false;
    this.log.namespace = (logger && logger.namespace) || "";
    this.log.color = (logger && logger.color) || "#f43f5e";
  }
}
