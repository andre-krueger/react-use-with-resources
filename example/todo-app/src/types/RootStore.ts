import FailingStore from "../stores/FailingStore";
import TodoStore from "../stores/TodoStore";
import TodoViewStore from "../stores/TodoViewStore";

export type RootStore = {
  todoStore: TodoStore;
  todoViewStore: TodoViewStore;
  failingStore: FailingStore;
};
