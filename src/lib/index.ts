import { Dispatch, useEffect, useMemo, useReducer, useState } from "react";

export type LoadingProps<T> = {
  [K in T as `${string & T}Loading`]: boolean;
};

export type ErrorProps<T> = {
  [K in keyof T as `${string & K}Error`]?: T[K];
};

export type RefreshProp<T> = { refresh: (keys?: T[]) => void };

export type UseWithResourcesProps<T> = LoadingProps<keyof T> &
  ErrorProps<T> &
  RefreshProp<keyof T>;

type Action =
  | { type: "error"; errorKey: string; error: unknown }
  | { type: "loading"; loadingKey: string; isLoading: boolean };

const reducer = (state: Record<string, unknown>, action: Action) => {
  switch (action.type) {
    case "error": {
      return {
        ...state,
        [action.errorKey]: action.error,
      };
    }
    case "loading":
      return {
        ...state,
        [action.loadingKey]: action.isLoading,
      };
  }
};

type AllOrNone<T> = T | { [K in keyof T]?: never };

type ActionValue = {
  resource: () => Promise<unknown>;
} & AllOrNone<{
  interval: number;
  currentTTL: number;
  setTTL: (interval: number) => void;
}>;

export type Actions<T> = {
  [Key in keyof T]: ActionValue;
};

export function useWithResourcesBase<T>(
  actions: Actions<T>
): {
  props: UseWithResourcesProps<T>;
  setRefreshRequested: Dispatch<boolean>;
  refresh: () => void;
} {
  let dataToFetch = Object.entries<ActionValue>(actions);
  const initialState = useMemo(
    () =>
      Object.keys(actions).reduce(
        (acc, key) => ({
          ...acc,
          [`${key}Loading`]: false,
          [`${key}Error`]: undefined,
        }),
        {}
      ),
    [actions]
  );
  const [reducerState, dispatch] = useReducer(reducer, initialState);
  const [refreshRequested, setRefreshRequested] = useState(true);

  const refresh = (requestedDataToRefresh?: string[]) => {
    if (requestedDataToRefresh !== undefined) {
      dataToFetch = dataToFetch.filter((resource) =>
        requestedDataToRefresh.includes(resource[0])
      );
    }
    dataToFetch.forEach((resource) => {
      if (resource[1].currentTTL && resource[1].setTTL) {
        resource[1].setTTL(0);
      }
    });
    setRefreshRequested(true);
  };

  useEffect(() => {
    if (refreshRequested) {
      Promise.all(
        dataToFetch.map(async (item) => {
          const itemTTL = item[1].currentTTL;
          const ttlExpired = itemTTL !== undefined && Date.now() >= itemTTL;
          if (itemTTL === undefined || ttlExpired) {
            try {
              if (reducerState[`${item[0]}Error`]) {
                dispatch({
                  type: "error",
                  errorKey: `${item[0]}Error`,
                  error: undefined,
                });
              }

              dispatch({
                type: "loading",
                loadingKey: `${item[0]}Loading`,
                isLoading: true,
              });

              await item[1].resource();

              dispatch({
                type: "loading",
                loadingKey: `${item[0]}Loading`,
                isLoading: false,
              });

              if (item[1].currentTTL !== undefined && item[1].setTTL) {
                item[1].setTTL(new Date().getTime() + item[1].interval);
              }
            } catch (error) {
              dispatch({
                type: "loading",
                loadingKey: `${item[0]}Loading`,
                isLoading: false,
              });
              dispatch({ type: "error", errorKey: `${item[0]}Error`, error });
            }
          }
        })
      ).then(() => {
        setRefreshRequested(false);
      });
    }
  }, [refreshRequested]);
  return {
    props: reducerState as UseWithResourcesProps<T>,
    setRefreshRequested,
    refresh,
  };
}

export function useWithResources<ErrorMap>(
  actions: Actions<ErrorMap>
): UseWithResourcesProps<ErrorMap> {
  const { props, refresh } = useWithResourcesBase<ErrorMap>(actions);
  return { ...props, refresh };
}
