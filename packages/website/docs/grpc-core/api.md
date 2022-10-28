---
sidebar_position: 1
---

# API

## Methods & Response Interface  {#APIReference}

```javascript
export interface ResponseData<T> {
    error?: unknown
    status?: 'SUCCESS' | 'ERROR'
    data?: T
}

export type ResponseInterface = Interfaces.ResponseData<any>

class Client extends BaseClient {
  instance: any;
  configured: boolean;
  listMethods: string[];
  interceptorRequest(onHeader: (header: HeaderConfigInterface | Record<string, any>) => void, onRejected: (error: any) => void): void;
  interceptorResponse(onResponse: (trailer: any) => void, onRejected: (error: any) => void): void;
  connect(ServiceClient: any, promiseType?: boolean): void;
  setConfig(config: HeaderConfigInterface): void;
  configure(): void;
  hasMethod(method: string): boolean;
  send(methodName: string, params: Record<string, any>, metadata?: MetadataInterface | undefined): Promise<ResponseInterface>;
}
```

### `instance`

```javascript
const instance = new Client({
    url: 'https://example.nx',
    retry: true
    metadata: { deadline: 1000, authorization: 'Access token' }
})
// connect gRpc Service client
instance.connect(ServiceClient)
```

### `setConfig()`

Allow to set config for client. Specify config defaults that will be applied to every request.

```javascript
interface HeaderConfigInterface {
  url: string
  metadata?: MetadataInterface
  logger?: Interfaces.Logger
}

instance.setConfig({
  url: 'https://example.nx',
  logger: {
    debug: true
  },
  metadata: {
    authorization: "AccessToken",
    deadline: 7000
  }
})

```

### `connect(args)`

Supports connect the gRPC Service Promises and Callbacks.

**Callback:**

```javascript
import { Client } from "@nixjs23n6/grpc-core";
import { ExampleClient } from "@example-proto/example_grpc_web_pb";

const instance = new Client({
    url: 'https://example.nx'
})

instance.connect(ExampleClient, false)
```

**Promise:**

```javascript
import { Client } from "@nixjs23n6/grpc-core";
import { ExampleClient } from "@example-proto/example_grpc_web_pb";

const instance = new Client({
    url: 'https://example.nx'
})

instance.connect(ExampleClient)
```

### `connected`

Check if a given Service Client connected.

```javascript
instance.connected 
> true // false
```

### `listMethods`

The function returns all methods from RPC service methods.

```javascript
instance.listMethods 
> ['refreshToken', 'testError', 'testGRPCError', 'testGRPCClient']
```

### `hasMethod()`

Check a method exists in RPC service methods.

```javascript
instance.hasMethod('refreshToken')
> true

instance.hasMethod('Nghinv')
> false
```

### `interceptorHeader(args)` {#interceptorHeader}

Add a request interceptor.

```javascript
instance.interceptorHeader (
    (config: any) => {
        // Do something before request is sent
        return config
    },
    (error: any) => {
        // Do something with request error
        return Promise.reject(error)
    }
)
```

### `interceptorResponse(args)` {#interceptorResponse}

Add a response interceptor.

```javascript
instance.interceptorResponse(
    (response: any) => {
        // Do something with response data
        return response
    },
    (error: any) => {
        // Do something with response error
        return Promise.reject(error)
    }
)
```

### `configure()`

:::note
To execute the Intercept [Request](#interceptorHeader) And [Response](#interceptorResponse), you must execute the `configure()` function.
:::

```javascript
instance.configure()
```

### `configured`

Check if executed the Intercept.

```javascript
instance.configured
> false // true
```

### `send(args)` {#send}

Client sends a request to server with any method.

**Parameters:**

- `methodName` - `string`: gRPC service methods.
- `params` - `Record<string, any>`: The parameters for gRPC services methods.
- `metadata` - `MetadataInterface | undefined`: Metadata is information about a particular RPC call (such as [authentication details](https://grpc.io/docs/guides/auth/)) in the form of a list of key-value pairs, where the keys are strings and the values are typically strings, but can be binary data. Metadata is opaque to gRPC itself - it lets the client provide information associated with the call to the server and vice versa. Please refer to [this article](https://grpc.io/docs/what-is-grpc/core-concepts/).

**Returns:**

The function returns a [ResponseInterface](#APIReference).

:::note
To set an empty value you need to use this: `new pbjs.Empty()`.

<https://pub.dev/documentation/google_speech/latest/generated_google_protobuf_empty.pb/generated_google_protobuf_empty.pb-library.html>
:::

```javascript
import * as pbjs from 'google-protobuf/google/protobuf/empty_pb'

instance.send('refreshToken', new pbjs.Empty(), { authorization: "Access token"})
```

**With parameters:**

```javascript
import { ExampleClientRequest } from '@example-proto/example_grpc_web_pb'

const request = new ExampleClientRequest()
// This is the parameters
request.setUserName('nghinv')
request.setAge('18')

instance.send('updateProfile', request).then((res: any) => { console.log(res) })
```

### `restoreSession(args)`

Restore previous requests.

**Parameters:**

- `context`:

```javascript
{
  methodName: string
  params: Record<string, any> 
  metadata?: MetadataInterface
}
```

- `metadataOverride` - `MetadataInterface | undefined` : Override the metadata.
  
Please refer to [this `send` methods](#send).

**Returns:**

The function returns a [ResponseInterface](#APIReference).
