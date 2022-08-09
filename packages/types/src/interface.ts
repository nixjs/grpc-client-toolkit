export declare namespace Interfaces {
  export interface Logger {
    debug?: boolean;
    namespace?: string;
    color?: string;
  }

  export interface ResponseData<T> {
    error?: unknown;
    status?: "SUCCESS" | "ERROR";
    data?: T;
  }
}
