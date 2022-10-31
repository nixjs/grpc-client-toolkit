export declare namespace Types {
  export type Object<T> = Record<string, T>;

  export type Nullable<T> = T | null;

  export type Undefined<T> = T | undefined;

  export type Class = { new (...args: any[]): any };

  export type Brand<K, T> = K & { __brand: T };

  export type Deferrable<T> = {
    [K in keyof T]: T[K];
  };
}
