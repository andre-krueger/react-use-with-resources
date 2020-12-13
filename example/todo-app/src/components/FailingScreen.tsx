import React, { ReactElement, useContext, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import {
  useWithResources,
  UseWithResourcesProps,
} from "react-use-with-resources";
import { RootStoreContext } from "../contexts/RootStore";
import ErrorDialog from "./ErrorDialog";
import LoadingIndicator from "./LoadingIndicator";

type ErrorMap = { failing: Error; succeeding: Error; cancelable: Error };

function FailingScreen(): ReactElement {
  const abortController = useMemo(() => new AbortController(), []);
  const {
    failingStore: { loadFailing, setHasRetried },
  } = useContext(RootStoreContext);
  const {
    failingError,
    failingLoading,
    succeedingLoading,
    cancelableLoading,
    cancelableError,
    refresh,
  } = useWithResources<ErrorMap>({
    failing: {
      resource: loadFailing,
    },
    succeeding: {
      resource: () => {
        return new Promise((res) => {
          setTimeout(() => {
            res(true);
          }, 1000);
        });
      },
    },
    cancelable: {
      resource: () => {
        const signal = abortController.signal;
        return fetch("http://localhost:3000/", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal,
        });
      },
    },
  });
  return (
    <div>
      <button
        onClick={() => {
          refresh();
        }}
      >
        Refresh all
      </button>
      <ErrorBoundary
        resetKeys={[failingError]}
        FallbackComponent={ErrorDialog}
        onReset={() => {
          setHasRetried();
          refresh(["failing"]);
        }}
      >
        <Failing
          failingLoading={failingLoading}
          failingError={failingError}
          refresh={refresh}
        />
      </ErrorBoundary>
      <div>
        {succeedingLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <h1>Succeeding resource finished loading</h1>
            <button
              onClick={() => {
                refresh(["succeeding"]);
              }}
            >
              Refresh
            </button>
          </>
        )}
      </div>
      <div>
        {cancelableLoading ? (
          <div>
            <h1>Loading...</h1>
            <button
              onClick={() => {
                abortController.abort();
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h1>Fetching from server done</h1>
            <h1>{cancelableError && cancelableError.message}</h1>
          </>
        )}
      </div>
    </div>
  );
}

function Failing({
  failingLoading,
  failingError,
  refresh,
}: {
  failingLoading: UseWithResourcesProps<ErrorMap>["failingLoading"];
  failingError: UseWithResourcesProps<ErrorMap>["failingError"];
  refresh: UseWithResourcesProps<ErrorMap>["refresh"];
}) {
  useErrorHandler(failingError);
  return (
    <div>
      {failingLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <h1>Failing resource finished loading</h1>
          <button
            onClick={() => {
              refresh(["failing"]);
            }}
          >
            Refresh
          </button>
        </>
      )}
    </div>
  );
}

export default observer(FailingScreen);
