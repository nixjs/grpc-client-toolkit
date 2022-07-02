export declare namespace Errors {
  export type ErrorResponse = {
    code: number;
    message: string;
  };

  export type ErrorStringifier = (params?: any) => string;

  export type ErrorFormatter = (params?: any) => ErrorResponse;

  export type Error<T> = {
    type: T;
    code: number;
    stringify: ErrorStringifier;
    format: ErrorFormatter;
  };
}
