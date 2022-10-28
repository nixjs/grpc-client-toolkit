# #gRpc Client

gRPC for Web Clients.

### Install

Install these dependencies:

`yarn add @nixjs23n6/grpc-core`

### Setup & Usage

```javascript
import { Client } from "@nixjs23n6/grpc-core";
import * as pbjs from "google-protobuf/google/protobuf/empty_pb";
import { ExampleClient } from "@example-proto/example_grpc_web_pb";

const grpcInstance = new Client({ url: "https://example.nixjs" });

grpcInstance.connect(ExampleClient, false);

grpcInstance.interceptorHeader(
  (config: any) => {
    return config;
  },
  (error: any) => {
    return Promise.resolve(error);
    // return Promise.reject(error)
  }
);
grpcInstance.interceptorResponse(
  (response: any) => {
    return response;
    // return response && response.toObject()
  },
  (error: any) => {
    return Promise.resolve(error);
    // return Promise.reject(error)
  }
);

grpcInstance.configure();

grpcInstance
  .send("getExample", new pbjs.Empty())
  .then((res: any) => console.log(res));
```

# #gRPC Client React

A react context which helps you to deal with gRPC web.

### Install

Install these dependencies:

`yarn add @nixjs23n6/grpc-core @nixjs23n6/grpc-react`

### Setup

```javascript
import React, { FC } from 'react';
import { GRPCProvider, ClientServiceSourceProps } from '@nixjs23n6/grpc-react'
import { ExampleClient1 } from '@example-proto/example_grpc_web_pb1'
import { ExampleClient2 } from '@example-proto/example_grpc_web_pb2'
import { ExampleClient3 } from '@example-proto/example_grpc_web_pb3'

const ClientServices: ClientServiceSourceProps[] = [
    {
        key: 'client1',
        source: ExampleClient1,
        config: { // optionals
            url: 'https://example.nixjs',
        },
    },
    {
        key: 'client2',
        source: ExampleClient2,
        config: { // optionals
            promiseType: true,
            storeKey: 'sessionAccessToken',
            storeType: 'session',
        },
    },
    {
        key: 'client3',
        source: ExampleClient3,
        config: { // optionals
            promiseType: true,
        },
    },
]

interface AppPropArg = {}

export const App: FC<AppPropArg> = () => {
    return (
        <GRPCProvider
        url="https://tech.example.nixjs"
        ClientServices={ClientServices}
        promiseType={false}
        logger={{ debug: true }}>
            <GrpcComponent/>
            { /* Your app's components go here, nested within the context providers. */ }
        </GRPCProvider>
    );
};

```

### Usage

```javascript
import React, { FC, useEffect } from 'react';
import { useGRPC } from '@nixjs23n6/grpc-react'
import * as pbjs from 'google-protobuf/google/protobuf/empty_pb'

interface GRPCPropArg = {}

export const GRPCComponent: FC<GRPCPropArg> = () => {
    const context = useGRPC()

    console.log('GRPC context', context)

    useEffect(() => {
        if (instance) {
            context.paymentClient.send('getExample1', new pbjs.Empty(), { authorization:'AccessToken'})
            .then((res: any) => {
                console.log('🚀 Response', res)
            })
            context.landingPageClient.send('getExample2', new pbjs.Empty()).then((res: any) => console.log(res))
        }
    }, [instance])

    return (<div>
        { /* Your app's components go here, nested within the context providers. */ }
    </div>)
};
```

# #Reference & Example

Visit: <https://grpc-client-toolkit.vercel.app/>
