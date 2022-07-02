import { Types } from "@nixjs/grpc-types";
import {
  Client,
  HeaderConfigInterface,
  MetadataInterface,
  ResponseInterface,
} from "@nixjs/grpc-core";

export interface ClientConfiguration {
  url: string;
  promiseType: boolean;
  storeKey?: string;
  storeType?: "localStorage" | "session";
  metadata?: MetadataInterface;
}

export interface ClientServiceSourceProps {
  key: string;
  source: any;
  config?: Partial<ClientConfiguration> & {
    url?: string;
    promiseType?: boolean;
  };
}

export interface InstanceStateInterface {
  url: string;
  client: Types.Nullable<Client>;
  instanceConnected: boolean;
  clientConnected: boolean;
  methods: string[];

  setConfig(config: HeaderConfigInterface): void;
  setInterceptors(
    onHeaderConfig?: (config: HeaderConfigInterface | Types.Object<any>) => any,
    onHeaderError?: (error: any) => any,
    onResponse?: (response: any) => any,
    onError?: (error: any) => any
  ): void;
  hasMethod(method: string): boolean;

  send(
    methodName: string,
    params: Record<string, any>,
    metadata?: MetadataInterface
  ): Promise<ResponseInterface>;
  sendWithAuth(
    methodName: string,
    params: Record<string, any>,
    metadata?: MetadataInterface
  ): Promise<ResponseInterface>;
}
