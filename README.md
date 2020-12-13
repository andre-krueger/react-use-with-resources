[![npm version](https://img.shields.io/npm/v/react-use-with-resources)](https://www.npmjs.com/package/react-use-with-resources)

# Installation

```
npm i --save react-use-with-resources
```

# Usage

This library can be used in `React` and `React Native` apps. There is an [example](/example/todo-app) that is using `React Router` to showcase the library's features. The example contains cancellation via `AbortController` for `fetch` and uses `Mobx` as the in-memory data storage and also shows an example of error handling via `ErrorBoundary`. 

In general, `react-use-with-resources` works best with global state management libraries like `Redux` or `Mobx`, as `react-use-with-resources` doesn't have any caching capabilities.

If you don't need caching, you can of course also use local state for the `fetch` results and just don't set any `TTL`. Then the data will be fetched on each mount.

To give a brief overview:

- You can set multiple resources that need to be resolved
- The hook returns error and loading props, named accordingly to the name you gave to the resources
- The error props can be typed, by providing an `ErrorMap` type to the hook 
- For each resource, you can define an optional `TTL`
- The hook exposes a `refresh` function, with which you can either refresh all resources, or specific ones
- The data fetching can bo done manually, if you wish so. Just use `setRefreshRequested(true)` which is returned from `useWithResourcesBase` whenever you want to fetch

If you need more trigger conditions, you can use the following example (for React Navigation):

```javascript
import {
  useWithResourcesBase,
  UseWithResourcesProps,
  Actions,
} from "react-use-with-resources";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useEffect, useMemo } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useWithResources<ErrorMap>(
  actions: Actions<ErrorMap>
): UseWithResourcesProps<ErrorMap> {
  const { props, refresh, setRefreshRequested } =
    useWithResourcesBase<ErrorMap>(actions);
  useFocusEffect(
    useCallback(() => {
      setRefreshRequested(true);
    }, [])
  );
  const isFocused = useIsFocused();
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active" && isFocused) {
        setRefreshRequested(true);
      }
    };
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, [isFocused]);
  return { ...props, refresh };
}
```

This will fetch the data (if TTL set, only when it is expired) if the screen is focused, or when the screen is focused and the app goes from background to foreground.