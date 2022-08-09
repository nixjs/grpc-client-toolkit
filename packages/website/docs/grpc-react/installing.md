---
sidebar_position: 1
---

# Installing

A react context which helps you to deal with gRPC web. To get started, use the following command:

## 🚀 Install with npm

`npm install @nixjs23n6/core @nixjs23n6/react`

## 🚀 Install with yarn

`yarn add @nixjs23n6/core @nixjs23n6/react`

## Setup & Usage

### Setup

```javascript
import React, { FC } from 'react';
import { GRPCProvider, ClientServiceSourceProps } from '@nixjs23n6/react'
import { ExampleClient1 } from '@example-proto/example_grpc_web_pb1'
import { ExampleClient2 } from '@example-proto/example_grpc_web_pb2'
import { ExampleClient3 } from '@example-proto/example_grpc_web_pb3'

const ClientServices: ClientServiceSourceProps[] = [
    {
        key: 'client1',
        source: ExampleClient1,
        config: { // optionals
            url: 'https://example.nx',
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
        url="https://tech.example.nx"
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
import { useGRPC } from '@nixjs23n6/react'
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
