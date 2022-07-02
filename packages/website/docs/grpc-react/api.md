---
sidebar_position: 1
---

# Api

## Context Interface

Regardless of how you access the context, it will look like:

:::note
For more details, please refer to [document](./../grpc-core/api.md)
:::

```javascript
interface InstanceStateInterface {
    url: string
    client: Types.Nullable<Client>
    instanceConnected: boolean
    clientConnected: boolean
    methods: string[]

    setConfig(config: HeaderConfigInterface): void
    setInterceptors(
        onHeaderConfig?: (config: HeaderConfigInterface | Types.Object<any>) => any,
        onHeaderError?: (error: any) => any,
        onResponse?: (response: any) => any,
        onError?: (error: any) => any
    ): void
    hasMethod(method: string): boolean

    send(methodName: string, params: Record<string, any>, metadata?: MetadataInterface): Promise<ResponseInterface>
    sendWithAuth(methodName: string, params: Record<string, any>, metadata?: MetadataInterface): Promise<ResponseInterface>
}
```
