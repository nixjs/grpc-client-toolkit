import { Types, BaseErrors } from "@nixjs23n6/types";
import { HeaderConfigInterface } from "./types";

export class BaseClient {
  serviceClient: any;
  config: HeaderConfigInterface | Types.Object<any>;
  constructor(config: HeaderConfigInterface) {
    if (!config.url) {
      throw BaseErrors.ERROR.MISSING_OR_INVALID.format({
        name: "config.url",
      });
    }
    this.config = config;
  }
}
