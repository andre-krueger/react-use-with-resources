import { Dispatch, SetStateAction } from "react";

export type ErrorHandler = Dispatch<SetStateAction<Error | null>>;
