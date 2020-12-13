import React from "react";
import ReactDOM from "react-dom";
import TodoStore from "./stores/TodoStore";
import App from "./components/App";
import { RootStoreContext } from "./contexts/RootStore";
import { RootStore } from "./types/RootStore";
import TodoViewStore from "./stores/TodoViewStore";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import ErrorDialog from "./components/ErrorDialog";
import FailingStore from "./stores/FailingStore";

function AppWrapper() {
  const errorHandler = useErrorHandler();

  const rootStore: RootStore = {
    todoStore: new TodoStore(errorHandler),
    todoViewStore: new TodoViewStore(),
    failingStore: new FailingStore(),
  };

  return (
    <RootStoreContext.Provider value={rootStore}>
      <App />
    </RootStoreContext.Provider>
  );
}

function AppWrapperWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorDialog}>
      <AppWrapper />
    </ErrorBoundary>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <AppWrapperWithErrorBoundary />
  </React.StrictMode>,
  document.getElementById("root")
);
