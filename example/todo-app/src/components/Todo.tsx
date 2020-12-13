import React, { CSSProperties, ReactElement } from "react";

type Props = {
  id?: number;
  title: string;
  description: string;
  done: boolean;
  onPressDone: (done: boolean) => void;
  onPressRemove?: (id: number) => void;
};

const style: { container: CSSProperties } = {
  container: {
    width: 100,
    height: "auto",
    borderStyle: "solid",
    margin: 2,
    padding: 4,
  },
};

function Todo({
  id,
  title,
  description,
  done,
  onPressDone,
  onPressRemove,
}: Props): ReactElement {
  return (
    <div style={{ ...style.container }}>
      <h3>{title}</h3>
      {description}
      <form>
        <label>
          Done?
          <input
            name="isGoing"
            type="checkbox"
            checked={done}
            onChange={(event) => {
              onPressDone(event.target.checked);
            }}
          />
        </label>
      </form>
      {done && (
        <button
          onClick={() => {
            if (onPressRemove && id) {
              onPressRemove(id);
            }
          }}
        >
          Remove
        </button>
      )}
    </div>
  );
}

export default Todo;
