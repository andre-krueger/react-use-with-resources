import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { useWithResources } from "react-use-with-resources";
import { RootStoreContext } from "../contexts/RootStore";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";
import FinishedTodoList from "./FinishedTodoList";
import LoadingIndicator from "./LoadingIndicator";
import { TODOS_TTL_MILLIS } from "../constants/ttl";

const style = { container: { flex: 1 } };

function TodoScreen() {
  const { todoStore, todoViewStore } = useContext(RootStoreContext);
  const { todosTTL, setTodosTTL } = todoViewStore;
  const { todosLoading, refresh } = useWithResources<{
    todos: Error;
  }>({
    todos: {
      resource: todoStore.fetchTodos,
      currentTTL: todosTTL,
      interval: TODOS_TTL_MILLIS,
      setTTL: setTodosTTL,
    },
  });

  if (todosLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div style={{ ...style.container }}>
      <AddTodo />
      <button
        onClick={() => {
          refresh();
        }}
      >
        Refresh todos
      </button>
      <div>
        <h1>Todos</h1>
        <TodoList />
      </div>
      <div>
        <h1>Finished todos</h1>
        <FinishedTodoList />
      </div>
    </div>
  );
}

export default observer(TodoScreen);
