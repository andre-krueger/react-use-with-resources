import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { RootStoreContext } from "../contexts/RootStore";
import Todo from "./Todo";
import TodoListContainer from "./TodoListContainer";

function TodoList() {
  const { todoStore } = useContext(RootStoreContext);

  return (
    <TodoListContainer>
      {todoStore.unfinishedTodos.map((todo) => (
        <div key={todo.id}>
          <Todo
            title={todo.title}
            description={todo.description}
            done={todo.done}
            onPressDone={(done) => {
              const newTodo = { ...todo };
              newTodo.done = done;
              todoStore.updateTodo(newTodo);
            }}
          />
        </div>
      ))}
    </TodoListContainer>
  );
}

export default observer(TodoList);
