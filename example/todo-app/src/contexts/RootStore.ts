import { Context, createContext } from "react";
import { RootStore } from "../types/RootStore";

export const RootStoreContext = createContext<RootStore | undefined>(
  undefined
) as Context<RootStore>;
