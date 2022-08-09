import grpcWeb from "grpc-web";
import { decode } from "js-base64";
import { Types } from "@nixjs23n6/types";
import {
  MetadataResponseErrorDetailType,
  MetadataResponseInterface,
  ResponseErrorInterface,
} from "./types";

function convertMetadataDetailToUtf8(code: string): Record<string, any>[] {
  const errorStr: string = decode(code) || "";
  return (errorStr && JSON.parse(errorStr)) || [];
}

export function getResponseMetadataDetailParser(
  response: MetadataResponseInterface
): Types.Nullable<MetadataResponseErrorDetailType> {
  if (!response || !response.details) return null;
  const errors: Record<string, any>[] = convertMetadataDetailToUtf8(
    response.details
  );
  const errorDic: MetadataResponseErrorDetailType = {};
  for (let i = 0; i < errors.length; i++) {
    errorDic[errors[i].metadata.code] = errors[i].metadata;
  }
  return errorDic;
}

export function getResponseErrorParser(
  error: grpcWeb.RpcError
): Types.Nullable<ResponseErrorInterface> {
  if (error.code !== grpcWeb.StatusCode.OK) {
    const { code, message } = error;
    const metadataError: Types.Nullable<MetadataResponseErrorDetailType> =
      getResponseMetadataDetailParser(error.metadata);
    const responseError: ResponseErrorInterface = {
      code,
      message: message,
      original: error,
    };
    if (metadataError) responseError.metadata = metadataError;
    return responseError;
  }
  return null;
}

export function getMethods(instance: any): string[] {
  try {
    if (!instance) return [];
    const listMethods: Record<string, (...args: any[]) => any> =
      Object.getPrototypeOf(instance);
    return Object.keys(listMethods);
  } catch (error) {
    return [];
  }
}
