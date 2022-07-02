---
sidebar_position: 1
---

# Introduction

## What is gRPC?

[gRPC is an open source](https://grpc.io/) is a modern open source high performance Remote Procedure Call (RPC) framework that can run in any environment. It can efficiently connect services in and across data centers with pluggable support for load balancing, tracing, health checking and authentication. It is also applicable in last mile of distributed computing to connect devices, mobile applications and browsers to backend services.

### Simple service definition

Define your service using Protocol Buffers, a powerful binary serialization toolset and language.

### Start quickly and scale

Install runtime and dev environments with a single line and also scale to millions of RPCs per second with the framework.

### Works across languages and platforms

Automatically generate idiomatic client and server stubs for your service in a variety of languages and platforms.

### Bi-directional streaming and integrated auth

Bi-directional streaming and fully integrated pluggable authentication with HTTP/2-based transport.

## gRPC Web {#grpc-web}

[gRPC-Web](https://github.com/grpc/grpc-web) is a javascript library using which we can directly talk to the gRPC service via web-browser. gRPC-Web clients connect to gRPC services via a special gateway proxy(Envoy proxy) which is going to be a docker service in our case running on the same server machine which bridges GRPC( HTTP/2) with Browser Communication (HTTP/1.1).

This was the game changer because initially we were able to use gRPC only for communications between services or micro-services and the client can only use REST API calls to access the data, but now by using the gRPC we can make use of the power of gRPC throughout our app and eliminate REST.

## 🚀 gRPC Client

gRPC Client is the port of [gRPC-Web](#grpc-web) library.

### Features

- Typescript first-class support.
- Set default gRPC configs.
- Supports connect the gRPC Service Promise and Callbacks.
- Get all the methods in gRPC Service.
- Interceptors.
- Easy to install, update and support thanks to npm packages.

### Packages

This library is organized into small packages with few dependencies.

| Package                                                                         | Description                                                                                     | npm                                                                                                                                           |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [GRPC Client](./grpc-core/installing.md)                                                 | This library is intended for both JavaScript and TypeScript usage from a web browser. | [`@nixjs/grpc-core`](https://github.com/nixjs/grpc-client/tree/main/packages/core)
| [GRPC Client React](./grpc-react/installing.md)                                                 | A react context which helps you to deal with gRPC web. | [`@nixjs/grpc-react`](https://github.com/nixjs/grpc-client/tree/main/packages/react)                                         |

### Build from Source

1. Clone the project:

```shell
git clone https://github.com/nixjs/grpc-client.git
```

2. Install dependencies:

```shell
cd grpc-web-client
yarn install
```

1. Build all packages:

```shell
yarn build
```

4. Run locally:

- *React:*

```shell
cd packages/starter/react-ui-starter
yarn start
```

- *Nextjs:*

```shell
cd packages/starter/next-ui-starter
yarn dev
```

## Reference

1. Repository: <https://github.com/nixjs/grpc-client>
2. gRPC: <https://grpc.io/>
3. gRPC-Web: <https://github.com/grpc/grpc-web>
