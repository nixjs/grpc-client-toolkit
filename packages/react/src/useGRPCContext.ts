import * as React from "react";
import { Types } from "@nixjs/grpc-types";
import { InstanceStateInterface } from "./types";

export const GRPCContext = React.createContext<
  Types.Object<InstanceStateInterface>
>({} as Types.Object<InstanceStateInterface>);

export function useGRPC(): Types.Object<InstanceStateInterface> {
  return React.useContext(GRPCContext);
}
