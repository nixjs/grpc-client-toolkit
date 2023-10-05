import grpcWeb from "grpc-web";
import * as pbjs from "google-protobuf/google/protobuf/empty_pb";
import { Interfaces, Types } from "@nixjs23n6/types";

/**
 * Date or milliseconds number
 */
export type Deadline = Date | number;

export interface MetadataInterface extends Types.Object<any> {
  deadline?: number;
  authorization?: string;
}

export interface HeaderConfigInterface {
  url: string;
  metadata?: MetadataInterface;
}

export interface HeaderContextInterface {
  methodName: string;
  metadata: MetadataInterface | undefined;
  params: Types.Object<any> | pbjs.Empty;
}

export type MetadataResponseErrorDetailType = Types.Object<{
  [x: string]: any;
  code: string;
  message: string;
}>;

export interface ResponseErrorInterface {
  [x: string]: any;
  code: grpcWeb.StatusCode | number;
  message: string;
  metadata?: MetadataResponseErrorDetailType;
  original: any;
}

export type ResponseInterface<T = any> = Interfaces.ResponseData<T>;

export interface MetadataResponseInterface {
  "content-type"?: string;
  "grpc-message"?: string;
  "grpc-status"?: string;
  details?: string;
}

export const GrpcStatusCode = grpcWeb.StatusCode;
