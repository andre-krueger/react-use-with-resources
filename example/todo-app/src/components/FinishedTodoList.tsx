import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { RootStoreContext } from "../contexts/RootStore";
import Todo from "./Todo";
import TodoListContainer from "./TodoListContainer";

function FinishedTodoList() {
  const { todoStore } = useContext(RootStoreContext);

  return (
    <TodoListContainer>
      {todoStore.finishedTodos.map((todo) => (
        <div key={todo.id}>
          <Todo
            id={todo.id}
            title={todo.title}
            description={todo.description}
            done={todo.done}
            onPressDone={(done) => {
              const newTodo = { ...todo };
              newTodo.done = done;
              todoStore.updateTodo(newTodo);
            }}
            onPressRemove={(id) => {
              todoStore.removeTodo(id);
            }}
          />
        </div>
      ))}
    </TodoListContainer>
  );
}

export default observer(FinishedTodoList);
