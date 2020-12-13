import { makeAutoObservable } from "mobx";

export default class TodoViewStore {
  todosTTL = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setTodosTTL = (newTTL: number): void => {
    this.todosTTL = newTTL;
  };
}
