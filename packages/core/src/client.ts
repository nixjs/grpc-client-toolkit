import grpcWeb from "grpc-web";
import { Errors, BaseErrors, Interfaces } from "@nixjs23n6/types";
import { Objectify } from "@nixjs23n6/objectify";
import {
  HeaderConfigInterface,
  HeaderContextInterface,
  MetadataInterface,
  ResponseInterface,
  ResponseErrorInterface,
} from "./types";
import { getResponseErrorParser, getMethods, getDeadline } from "./utils";
import { BaseClient } from "./baseClient";
import { ERROR } from "./error";

export class Client extends BaseClient {
  #requestFulfilled: any;
  #requestRejected: any;

  #responseFulfilled: any;
  #responseRejected: any;
  #metadata: MetadataInterface | undefined;
  #ServiceClient: any;

  #isServiceClientPromise = false; // check the ServiceClient is a Promise or callback services
  #connected = false;

  instance: any; // gRPC service
  configured: boolean; // config interceptors for request and response
  listMethods: string[] = []; // List methods in gRPC service

  constructor(config: HeaderConfigInterface, logger?: Interfaces.Logger) {
    super(config, logger);
    this.#metadata = config.metadata || {};
    this.configured = false;
    this.#connected = false;
  }

  public get connected(): boolean {
    return this.#connected;
  }

  public set connected(v: boolean) {
    this.#connected = v;
  }

  public interceptorHeader(
    onHeader: (header: HeaderConfigInterface | Record<string, any>) => void,
    onRejected: (error: any) => void
  ): void {
    this.#requestFulfilled = onHeader;
    this.#requestRejected = onRejected;
  }

  public interceptorResponse(
    onResponse: (response: any) => any,
    onRejected: (error: any) => any
  ): void {
    this.#responseFulfilled = onResponse;
    this.#responseRejected = onRejected;
  }

  public connect(ServiceClient: any, promiseType = true): void {
    this.#ServiceClient = ServiceClient;
    this.instance = new ServiceClient(this.config.url);
    this.listMethods = getMethods(this.instance);
    this.#isServiceClientPromise = promiseType;
    this.connected = true;
    this.log("\n\n");
    this.log(
      `» %c🚀 Methods of the %c${this.log.namespace}`,
      `color: #2192FF; font-size:12px`,
      `color: #E64848; font-size:12px;font-weight:bold`,
      this.listMethods
    );
    this.log("\n\n");
  }

  // Specify config defaults that will be applied to every request. [Optional]
  public setConfig(config: HeaderConfigInterface): void {
    if (
      config.url &&
      config.url.toLocaleLowerCase !== this.config.url.toLocaleLowerCase()
    ) {
      this.instance = new this.#ServiceClient(config.url);
    }
    this.config = Objectify.merge(this.config, config);
    this.#metadata = this.config.metadata ? this.config.metadata : {};
  }

  public configure(): void {
    if (this.#requestRejected && typeof this.#requestRejected === "function") {
      const config: HeaderConfigInterface = this.#requestFulfilled();
      if (typeof config !== "undefined") {
        this.setConfig(config);
      }
    }
    this.configured = true;
  }

  async #interceptorHeaderHandler(
    context: {
      methodName: string;
      metadata: MetadataInterface | undefined;
      params: Record<string, any>;
    },
    error: ResponseErrorInterface,
    onRejected: (args: Errors.ErrorResponse) => void,
    onFulfilled: (args: ResponseErrorInterface) => void
  ): Promise<boolean | void> {
    if (!error) return true;
    let err: ResponseErrorInterface = error;
    if (
      this.configured &&
      this.#requestRejected &&
      typeof this.#requestRejected === "function"
    ) {
      const log: any = await this.#requestRejected({
        context,
        error,
      });
      if (!log || typeof log === "undefined") {
        return onRejected(ERROR.INTERCEPTOR_BLOCKED.format());
      }
      err = log.error || log;
    }
    if (err) {
      return onFulfilled(err);
    }
    return true;
  }

  async #interceptorResponseHandler(
    context: {
      methodName: string;
      metadata: MetadataInterface | undefined;
      params: Record<string, any>;
    },
    error: grpcWeb.RpcError,
    onRejected: (args: Errors.ErrorResponse) => void,
    onFulfilled: (args: grpcWeb.RpcError) => void,
    onRestoreSessionFulfilled: (args: ResponseInterface) => void
  ): Promise<boolean | void> {
    if (!error) return true;
    let err: grpcWeb.RpcError = error;
    if (
      this.configured &&
      this.#responseRejected &&
      typeof this.#responseRejected === "function"
    ) {
      const log: any = await this.#responseRejected({
        context,
        error,
      });
      if (!log || typeof log === "undefined") {
        return onRejected(ERROR.INTERCEPTOR_BLOCKED.format());
      }
      if (log?.status) {
        if ((log as ResponseInterface).status === "SUCCESS") {
          return onRestoreSessionFulfilled((log as ResponseInterface).data);
        }
        err = (log as ResponseInterface).error as any;
      } else {
        err = log.error || log;
      }
    }
    if (err) {
      return onFulfilled(err);
    }
    return true;
  }

  async #returnResponseSuccessful(
    response: any,
    resolve: (args: ResponseInterface) => void
  ) {
    resolve({
      status: "SUCCESS",
      data: this.configured ? this.#responseFulfilled(response) : response,
    });
  }

  async #returnResponseFailed(
    context: {
      methodName: string;
      metadata: MetadataInterface | undefined;
      params: Record<string, any>;
    },
    error: grpcWeb.RpcError,
    resolve: (args: ResponseInterface) => void,
    reject: (args: any) => void
  ) {
    await this.#interceptorResponseHandler(
      context,
      error,
      (rejected) => reject(rejected),
      (fulfilled) =>
        resolve({
          status: "ERROR",
          error: fulfilled && getResponseErrorParser(fulfilled),
        }),
      (restoreSessionResponse) =>
        resolve({
          status: "SUCCESS",
          data: this.configured
            ? this.#responseFulfilled(restoreSessionResponse)
            : restoreSessionResponse,
        })
    );
  }

  public hasMethod(method: string): boolean {
    for (let i = 0; i < this.listMethods.length; i++) {
      if (this.listMethods[i] === method) {
        return true;
      }
    }
    return false;
  }

  public async restoreSession(
    context: {
      methodName: string;
      metadata: MetadataInterface | undefined;
      params: Record<string, any>;
    },
    metadataOverride?: MetadataInterface
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const { methodName, metadata, params } = context;
      let ourMetadata = metadata;
      if (metadataOverride) {
        ourMetadata = Objectify.merge(metadata, metadataOverride);
      }

      if (this.#metadata?.deadline) {
        ourMetadata = Objectify.merge(ourMetadata, {
          deadline: getDeadline(this.#metadata?.deadline),
        });
      }
      // Response
      if (this.#isServiceClientPromise) {
        try {
          const response: any = await this.instance?.[methodName](
            params,
            ourMetadata
          );
          resolve({ status: "SUCCESS", data: response });
        } catch (error: any) {
          reject({
            status: "ERROR",
            error,
          });
        }
      } else {
        this.instance?.[methodName](
          params,
          ourMetadata,
          async (error: grpcWeb.RpcError, response: any) => {
            if (error) {
              reject({
                status: "ERROR",
                error,
              });
            } else {
              resolve({
                status: "SUCCESS",
                data: response,
              });
            }
          }
        );
      }
    });
  }

  public async send(
    methodName: string,
    params: Record<string, any>,
    metadata?: MetadataInterface
  ): Promise<ResponseInterface> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      let headerError: any = null;

      if (!this.hasMethod(methodName)) {
        headerError = BaseErrors.ERROR.METHOD_NOT_FOUND.format({
          name: methodName,
        });
      }
      if (
        this.#requestFulfilled &&
        typeof this.#requestFulfilled === "function"
      ) {
        const config: HeaderConfigInterface = this.#requestFulfilled();
        if (typeof config !== "undefined") {
          this.setConfig(config);
        }
      }
      if (metadata) {
        this.#metadata = Objectify.merge(this.#metadata, metadata);
      }
      if (this.#metadata?.deadline) {
        this.#metadata = Objectify.merge(this.#metadata, {
          deadline: getDeadline(this.#metadata?.deadline),
        });
      }
      const context: HeaderContextInterface = {
        methodName,
        metadata: this.#metadata,
        params,
      };
      // Header
      const headerResolved: any = await this.#interceptorHeaderHandler(
        context,
        headerError,
        (rejected) => reject(rejected),
        (fulfilled) =>
          resolve({
            status: "ERROR",
            error: fulfilled,
          })
      );

      if (!headerResolved) {
        return resolve(headerResolved);
      }
      // Response
      if (this.#isServiceClientPromise) {
        try {
          const response: any = await this.instance?.[methodName](
            params,
            this.#metadata
          );
          this.#logSuccess({
            methodName,
            params,
            metadata: this.#metadata,
            response,
          });
          this.#returnResponseSuccessful(response, resolve);
        } catch (error: any) {
          this.#logFailure({
            methodName,
            params,
            metadata: this.#metadata,
            response: error,
          });
          await this.#returnResponseFailed(context, error, resolve, reject);
        }
      } else {
        this.instance?.[methodName](
          params,
          this.#metadata,
          async (error: grpcWeb.RpcError, response: any) => {
            if (error) {
              this.#logFailure({
                methodName,
                params,
                metadata: this.#metadata,
                response: error,
              });
              await this.#returnResponseFailed(context, error, resolve, reject);
            } else {
              this.#logSuccess({
                methodName,
                params,
                metadata: this.#metadata,
                response,
              });
              this.#returnResponseSuccessful(response, resolve);
            }
          }
        );
      }
    });
  }

  #logRequest({
    methodName,
    params,
    metadata,
  }: {
    methodName: string;
    params: Record<string, any>;
    metadata?: MetadataInterface;
  }) {
    this.log.namespace = this.logger?.namespace || "";
    this.log(
      `%c🚀 REQUEST - %c${methodName}`,
      `color: #2192FF; font-size:12px;font-weight:bold`,
      `color: #E64848; font-size:12px`
    );
    this.log.namespace = "";
    this.log({ params, metadata });
  }

  #logSuccess({
    methodName,
    params,
    metadata,
    response,
  }: {
    methodName: string;
    params: Record<string, any>;
    metadata?: MetadataInterface;
    response: any;
  }) {
    this.log("\n\n");
    // Request
    this.#logRequest({ methodName, params, metadata });
    // Response
    this.log.namespace = this.logger?.namespace || "";
    this.log.color = this.logger?.color || "#f43f5e";
    this.log(
      `%c✨ RESPONSE`,
      `color: #6BCB77; font-size:12px;font-weight:bold`
    );
    this.log.namespace = "";
    this.log.color = "";
    this.log(`\t\t%cOriginal`, `color: #6BCB77; font-size:10px`, response);
    this.log(
      `\t\t%cFormatted`,
      `color: #6BCB77; font-size:10px`,
      response && response?.toObject()
    );
    this.log("\n\n");
  }

  #logFailure({
    methodName,
    params,
    metadata,
    response,
  }: {
    methodName: string;
    params: Record<string, any>;
    metadata?: MetadataInterface;
    response: any;
  }) {
    this.log("\n\n");
    // Request
    this.#logRequest({ methodName, params, metadata });
    // Response
    this.log.namespace = this.logger?.namespace || "";
    this.log.color = this.logger?.color || "#f43f5e";
    this.log(
      `%c✨ RESPONSE`,
      `color: #FF6B6B; font-size:12px;font-weight:bold`
    );
    this.log.namespace = "";
    this.log.color = "";
    this.log(`\t\t%cOriginal`, `color: #FF6B6B; font-size:10px`, response);
    this.log("💧\n\n\n\n\n\n");
  }
}
