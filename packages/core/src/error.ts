import { BaseErrors, Errors } from "@nixjs23n6/types";

export const ERROR_TYPE = BaseErrors.enumify({
  INTERCEPTOR_BLOCKED: "INTERCEPTOR_BLOCKED",
});

type ErrorType = keyof typeof ERROR_TYPE;

type Error<T> = {
  type: T;
  code: number;
  stringify: Errors.ErrorStringifier;
  format: Errors.ErrorFormatter;
};

export const ERROR: Record<ErrorType, Error<ErrorType>> = {
  [ERROR_TYPE.INTERCEPTOR_BLOCKED]: {
    type: ERROR_TYPE.INTERCEPTOR_BLOCKED,
    code: 10002,
    stringify: () =>
      "The event is not emitted in the interceptor. Must use returns a Promise object. `return Promise.resolve(error)` or `return Promise.reject(error)`.",
    format: (params?: any) => ({
      code: ERROR[ERROR_TYPE.INTERCEPTOR_BLOCKED].code,
      message: ERROR[ERROR_TYPE.INTERCEPTOR_BLOCKED].stringify(params),
    }),
  },
};
