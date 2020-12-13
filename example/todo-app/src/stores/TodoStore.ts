import { makeAutoObservable, runInAction } from "mobx";
import { ErrorHandler } from "../types/ErrorHandler";
import { NewTodo, Todo } from "../types/Todo";

function delay(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds));
}

export default class TodoStore {
  todos: Array<Todo> = [];
  errorHandler: ErrorHandler;

  constructor(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler;
    makeAutoObservable(this);
  }

  fetchTodos = async (): Promise<void> => {
    const todos = localStorage.getItem("todos");
    if (todos) {
      await delay(1000);
      runInAction(() => {
        this.todos = JSON.parse(todos);
      });
    }
  };

  addTodo(todo: NewTodo): void {
    let id = 0;
    if (this.todos.length > 0) {
      id = Math.max(...this.todos.map((o) => o.id));
    }
    this.todos.push({ id: id + 1, ...todo });
  }

  removeTodo(todoId: number): void {
    this.todos = this.todos.filter((item) => item.id !== todoId);
  }

  updateTodo(todo: Todo): void {
    try {
      const index = this.todos.findIndex((item) => item.id === todo.id);
      this.todos[index] = todo;
    } catch (e) {
      this.errorHandler(e);
    }
  }

  get unfinishedTodos(): Array<Todo> {
    return this.todos.filter((todo) => todo.done === false);
  }

  get finishedTodos(): Array<Todo> {
    return this.todos.filter((todo) => todo.done === true);
  }
}
