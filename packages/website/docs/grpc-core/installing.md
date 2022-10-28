---
sidebar_position: 1
---

# Installing

To get started, use the following command:

## 🚀 Install with npm

`npm install @nixjs23n6/grpc-core`

## 🚀 Install with yarn

`yarn add @nixjs23n6/grpc-core`

## Setup & Usage

### Quick Setup

```javascript
import { Client } from "@nixjs23n6/grpc-core";
import * as pbjs from "google-protobuf/google/protobuf/empty_pb";
import { ExampleClient } from "@example-proto/example_grpc_web_pb";

const grpcInstance = new Client({ url: "https://example.nx" });

grpcInstance.connect(ExampleClient, false);

grpcInstance
  .send("getExample", new pbjs.Empty())
  .then((res: any) => console.log(res));
```

### Advanced

You can intercept requests or responses before they are handled by then or catch.

```javascript
import { Client } from "@nixjs23n6/grpc-core";
import * as pbjs from "google-protobuf/google/protobuf/empty_pb";
import { ExampleClient } from "@example-proto/example_grpc_web_pb";

const grpcInstance = new Client({ url: "https://example.nx" });

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
