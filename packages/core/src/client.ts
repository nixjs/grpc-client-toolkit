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
import { getResponseErrorParser, getMethods } from "./utils";
import { BaseClient } from "./baseClient";
import { ERROR } from "./error";

export class Client extends BaseClient {
  private _requestFulfilled: any;
  private _requestRejected: any;

  private _responseFulfilled: any;
  private _responseRejected: any;
  private _metadata: MetadataInterface | undefined;
  private _ServiceClient: any;

  private _isServiceClientPromise = false; // check the ServiceClient is a Promise or callback services
  private _connected = false;

  instance: any; // gRPC service
  configured: boolean; // config interceptors for request and response
  listMethods: string[] = []; // List methods in gRPC service

  constructor(config: HeaderConfigInterface, logger?: Interfaces.Logger) {
    super(config, logger);
    this._metadata = config.metadata || {};
    this.configured = false;
    this._connected = false;
  }

  public get connected(): boolean {
    return this._connected;
  }

  public set connected(v: boolean) {
    this._connected = v;
  }

  public interceptorHeader(
    onHeader: (header: HeaderConfigInterface | Record<string, any>) => void,
    onRejected: (error: any) => void
  ): void {
    this._requestFulfilled = onHeader;
    this._requestRejected = onRejected;
  }

  public interceptorResponse(
    onResponse: (response: any) => any,
    onRejected: (error: any) => any
  ): void {
    this._responseFulfilled = onResponse;
    this._responseRejected = onRejected;
  }

  public connect(ServiceClient: any, promiseType = true): void {
    this._ServiceClient = ServiceClient;
    this.instance = new ServiceClient(this.config.url);
    this.listMethods = getMethods(this.instance);
    this._isServiceClientPromise = promiseType;
    this.connected = true;
    this.log("💧");
    this.log(
      `» %c🚀Methods of the %c${this.log.namespace}`,
      `color: #2192FF; font-size:14px`,
      `color: #E64848; font-size:14px`,
      this.listMethods
    );
    this.log("💧\n\n\n\n\n\n");
  }

  // Specify config defaults that will be applied to every request. [Optional]
  public setConfig(config: HeaderConfigInterface): void {
    if (
      config.url &&
      config.url.toLocaleLowerCase !== this.config.url.toLocaleLowerCase()
    ) {
      this.instance = new this._ServiceClient(config.url);
    }
    this.config = Objectify.merge(this.config, config);
    this._metadata = this.config.metadata ? this.config.metadata : {};
  }

  public configure(): void {
    if (this._requestRejected && typeof this._requestRejected === "function") {
      const config: HeaderConfigInterface = this._requestFulfilled();
      if (typeof config !== "undefined") {
        this.setConfig(config);
      }
    }
    this.configured = true;
  }

  private async _interceptorHeaderHandler(
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
      this._requestRejected &&
      typeof this._requestRejected === "function"
    ) {
      const log: any = await this._requestRejected({
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

  private async _interceptorResponseHandler(
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
      this._responseRejected &&
      typeof this._responseRejected === "function"
    ) {
      const log: any = await this._responseRejected({
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

  private async _returnResponseSuccessful(
    response: any,
    resolve: (args: ResponseInterface) => void
  ) {
    resolve({
      status: "SUCCESS",
      data: this.configured ? this._responseFulfilled(response) : response,
    });
  }

  private async _returnResponseFailed(
    context: {
      methodName: string;
      metadata: MetadataInterface | undefined;
      params: Record<string, any>;
    },
    error: grpcWeb.RpcError,
    resolve: (args: ResponseInterface) => void,
    reject: (args: any) => void
  ) {
    await this._interceptorResponseHandler(
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
            ? this._responseFulfilled(restoreSessionResponse)
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
      // Response
      if (this._isServiceClientPromise) {
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
        this._requestFulfilled &&
        typeof this._requestFulfilled === "function"
      ) {
        const config: HeaderConfigInterface = this._requestFulfilled();
        if (typeof config !== "undefined") {
          this.setConfig(config);
        }
      }
      if (metadata) {
        this._metadata = Objectify.merge(this._metadata, metadata);
      }
      const context: HeaderContextInterface = {
        methodName,
        metadata: this._metadata,
        params,
      };
      // Header
      const headerResolved: any = await this._interceptorHeaderHandler(
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
      if (this._isServiceClientPromise) {
        try {
          const response: any = await this.instance?.[methodName](
            params,
            this._metadata
          );
          this._logSuccess({
            methodName,
            params,
            metadata,
            response,
          });
          this._returnResponseSuccessful(response, resolve);
        } catch (error: any) {
          this._logFailure({
            methodName,
            params,
            metadata,
            response: error,
          });
          await this._returnResponseFailed(context, error, resolve, reject);
        }
      } else {
        this.instance?.[methodName](
          params,
          this._metadata,
          async (error: grpcWeb.RpcError, response: any) => {
            if (error) {
              this._logFailure({
                methodName,
                params,
                metadata,
                response: error,
              });
              await this._returnResponseFailed(context, error, resolve, reject);
            } else {
              this._logSuccess({
                methodName,
                params,
                metadata,
                response,
              });
              this._returnResponseSuccessful(response, resolve);
            }
          }
        );
      }
    });
  }

  private _logSuccess({
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
    this.log("💧");
    this.log(
      `\t%c🚀Request - %c${methodName}`,
      `color: #2192FF; font-size:14px`,
      `color: #E64848; font-size:14px`,
      {
        params,
        metadata,
      }
    );
    this.log(`\t%c✨Response`, `color: #6BCB77; font-size:14px`, response);
    this.log("💧\n\n\n\n\n\n");
  }

  private _logFailure({
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
    this.log("💧");
    this.log(
      `\t%c🚀Request - %c${methodName}`,
      `color: #2192FF; font-size:14px`,
      `color: #E64848; font-size:14px`,
      {
        params,
        metadata,
      }
    );
    this.log(`\t%c✨Response`, `color: #FF6B6B; font-size:14px`, response);
    this.log("💧\n\n\n\n\n\n");
  }
}
