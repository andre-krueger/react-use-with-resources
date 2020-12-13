import React, { ReactElement } from "react";
import { FallbackProps } from "react-error-boundary";

function ErrorDialog({
  error,
  resetErrorBoundary,
}: FallbackProps): ReactElement {
  return (
    <div>
      <h1>Something bad happened</h1>
      <div>{error.message}</div>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

export default ErrorDialog;
