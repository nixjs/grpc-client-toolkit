import type { Types } from "./types";
import type { Errors } from "./error";

export const enumify = <T extends Record<string, U>, U extends string>(
  x: T
): T => x;

export const ERROR_TYPE = enumify({
  METHOD_NOT_FOUND: "METHOD_NOT_FOUND",
  DATA_NOT_FOUND: "DATA_NOT_FOUND",
  MISSING_OR_INVALID: "MISSING_OR_INVALID",
  UNKNOWN: "UNKNOWN",
});

type ErrorType = keyof typeof ERROR_TYPE;

type Error<T> = {
  type: T;
  code: number;
  stringify: Errors.ErrorStringifier;
  format: Errors.ErrorFormatter;
};

const defaultParams: Types.Object<string> = {
  message: "Something went wrong",
  name: "parameter",
};

export const ERROR: Record<ErrorType, Error<ErrorType>> = {
  [ERROR_TYPE.DATA_NOT_FOUND]: {
    type: ERROR_TYPE.DATA_NOT_FOUND,
    code: 90000,
    stringify: (params?: any) => `Data not found: ${params.name} `,
    format: (params?: any) => ({
      code: ERROR[ERROR_TYPE.DATA_NOT_FOUND].code,
      message: ERROR[ERROR_TYPE.DATA_NOT_FOUND].stringify(params),
    }),
  },
  [ERROR_TYPE.METHOD_NOT_FOUND]: {
    type: ERROR_TYPE.METHOD_NOT_FOUND,
    code: 90001,
    stringify: (params?: any) => `Method not found: ${params.name} `,
    format: (params?: any) => ({
      code: ERROR[ERROR_TYPE.METHOD_NOT_FOUND].code,
      message: ERROR[ERROR_TYPE.METHOD_NOT_FOUND].stringify(params),
    }),
  },
  [ERROR_TYPE.MISSING_OR_INVALID]: {
    type: ERROR_TYPE.MISSING_OR_INVALID,
    code: 90002,
    stringify: (params?: any) =>
      `Missing or invalid ${params?.name || defaultParams.name}`,
    format: (params?: any) => ({
      code: ERROR[ERROR_TYPE.MISSING_OR_INVALID].code,
      message: ERROR[ERROR_TYPE.MISSING_OR_INVALID].stringify(params),
    }),
  },
  [ERROR_TYPE.UNKNOWN]: {
    type: ERROR_TYPE.UNKNOWN,
    code: 90003,
    stringify: (params?: any) => {
      let result = "";
      if (params) {
        result = params.toString();
      }
      return `Unknown error ${result}`;
    },
    format: (params?: any) => ({
      code: ERROR[ERROR_TYPE.UNKNOWN].code,
      message: ERROR[ERROR_TYPE.UNKNOWN].stringify(params),
    }),
  },
};
