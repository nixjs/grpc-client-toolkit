import { Types, BaseErrors, Interfaces } from "@nixjs23n6/types";
import debug from "debug";
import { HeaderConfigInterface } from "./types";

export class BaseClient {
  serviceClient: any;
  config: HeaderConfigInterface | Types.Object<any>;
  log: debug.Debugger;
  constructor(config: HeaderConfigInterface, logger?: Interfaces.Logger) {
    if (!config.url) {
      throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
        name: "config.url",
      });
    }
    this.config = config;
    this.log = debug("");
    this.log.enabled = (logger && logger.debug) || false;
    this.log.namespace = (logger && logger.namespace) || "";
    this.log.color = (logger && logger.color) || "#D3DEDC";
  }
}
