import * as React from "react";
import { Types, BaseErrors } from "@nixjs23n6/types";
import {
  Client,
  HeaderConfigInterface,
  MetadataInterface,
  merge,
} from "@nixjs23n6/core";
import {
  ClientConfiguration,
  ClientServiceSourceProps,
  InstanceStateInterface,
} from "./types";
import { GRPCContext } from "./useGRPCContext";

const createClient = ({
  url,
  metadata,
}: Pick<ClientConfiguration, "url" | "metadata">): Client =>
  new Client({
    url,
    metadata,
  });

export const createInstance = ({
  url,
  promiseType,
  metadata,
  ClientService,
  storeType = "localStorage",
  storeKey = "accessToken",
}: ClientConfiguration & { ClientService: any }): InstanceStateInterface => {
  const client = createClient({ url, metadata });

  client.connect(ClientService, promiseType);

  const onPreload = () => {
    if (!client.connected) client.connect(ClientService, promiseType);
  };

  const onSetInterceptor = (
    onHeaderConfig?: (config: HeaderConfigInterface | Types.Object<any>) => any,
    onHeaderError?: (error: any) => any,
    onResponse?: (response: any) => any,
    onError?: (error: any) => any
  ): void => {
    if (!client)
      throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: "instance" });
    onPreload();
    client.interceptorHeader(
      (config) => {
        if (!onHeaderConfig) return config;
        return onHeaderConfig(config);
      },
      (error) => {
        if (!onHeaderError) return Promise.reject(error);
        return onHeaderError(error);
      }
    );

    client.interceptorResponse(
      (response) => {
        if (!onResponse) return response;
        return onResponse(response);
      },
      (error) => {
        if (!onError) return Promise.reject(error);
        return onError(error);
      }
    );
    // Accept to enable interceptor
    client.configure();
  };

  // Specify config defaults that will be applied to every request. [Optional]
  const onSetConfig = (config: HeaderConfigInterface) => {
    if (!config)
      throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: "config" });
    if (!client)
      throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: "instance" });
    onPreload();
    client.setConfig(config);
  };

  const onHasMethod = (methodName: string) => {
    if (!client)
      throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: "instance" });
    onPreload();
    return client.hasMethod(methodName);
  };

  const onSend = async (
    methodName: string,
    params: Record<string, any>,
    metadata?: MetadataInterface
  ) => {
    if (!client)
      throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: "instance" });
    onPreload();
    return await client.send(methodName, params, metadata);
  };

  const onSendAuth = async (
    methodName: string,
    params: Record<string, any>,
    metadata?: MetadataInterface
  ) => {
    if (!client)
      throw BaseErrors.ERROR.MISSING_OR_INVALID.format({ name: "instance" });
    onPreload();
    let authorization = "";
    if (storeType === "localStorage") {
      authorization = localStorage.getItem(storeKey) as string;
    } else if (storeType === "session") {
      authorization = sessionStorage.getItem(storeKey) as string;
    }
    if (!authorization) {
      throw BaseErrors.ERROR.DATA_NOT_FOUND.format({ name: storeKey });
    }
    let metadataCustomize: Types.Undefined<MetadataInterface> = undefined;
    if (authorization && metadata) {
      metadataCustomize = metadata;
      metadataCustomize.authorization = authorization;
    }
    metadataCustomize = {
      authorization,
    };
    return await client.send(methodName, params, metadataCustomize);
  };

  return {
    url,
    client,
    methods: client.listMethods,
    setInterceptors: onSetInterceptor,
    clientConnected: !!client,
    instanceConnected: client.connected,
    hasMethod: onHasMethod,
    setConfig: onSetConfig,
    send: onSend,
    sendWithAuth: onSendAuth,
  };
};

export const GRPCProvider: React.FC<
  ClientConfiguration & {
    children: React.ReactNode;
    ClientServices: ClientServiceSourceProps[];
  }
> = ({
  children,
  url,
  ClientServices,
  promiseType,
  metadata,
  storeType = "localStorage",
  storeKey = "accessToken",
}) => {
  const GRPCContextValue: Types.Object<InstanceStateInterface> =
    React.useMemo(() => {
      const instances: Types.Object<InstanceStateInterface> | null = {};
      for (let index = 0; index < ClientServices.length; index++) {
        const client = ClientServices[index];

        const theirConfig = merge(
          {
            url,
            ClientServices,
            promiseType,
            metadata,
            storeType,
            storeKey,
          },
          client.config
        ) as ClientConfiguration;

        instances[client.key] = createInstance({
          ClientService: client.source,
          ...theirConfig,
        });
      }
      return instances;
    }, [url, promiseType, metadata, storeKey, storeType, ClientServices]);

  return (
    <GRPCContext.Provider value={GRPCContextValue}>
      {children}
    </GRPCContext.Provider>
  );
};
