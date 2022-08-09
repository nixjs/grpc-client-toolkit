export function isArray(val: any): boolean {
  return Array.isArray(val);
}

export function isPlainObject(val: any): boolean {
  if (toString.call(val) !== "[object Object]") {
    return false;
  }

  const prototype: Record<string, (...args: any[]) => any> =
    Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

function forEach(obj: any, fn: (...args: any[]) => any): any {
  // Don't bother if no value provided
  if (obj === null || typeof obj === "undefined") {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== "object") {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (let i = 0; i < obj.length; i++) {
      // eslint-disable-next-line no-useless-call
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // eslint-disable-next-line no-useless-call
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

export function merge(...args: any[]): Record<string, any> {
  const result: any = {};
  function assignValue(val: any, key: string): any {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (let i = 0; i < arguments.length; i++) {
    forEach(args[i], assignValue);
  }
  return result;
}
