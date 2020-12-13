import React, { CSSProperties, ReactElement, ReactNode } from "react";

const style: { container: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
};

type Props = { children: ReactNode };

function TodoListContainer({ children }: Props): ReactElement {
  return <div style={{ ...style.container }}>{children}</div>;
}

export default TodoListContainer;
