import React, { ReactElement, useContext, useState } from "react";
import { RootStoreContext } from "../contexts/RootStore";

function AddTodo(): ReactElement {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { todoStore } = useContext(RootStoreContext);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        todoStore.addTodo({ title, description, done: false });
      }}
    >
      <label>
        Title:
        <input
          type="text"
          name="Title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </label>
      <label>Description</label>
      <textarea
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
        }}
      />
      <input type="submit" value="Add todo" />
    </form>
  );
}

export default AddTodo;
