export type Todo = {
  id: number;
  title: string;
  description: string;
  done: boolean;
};

export type NewTodo = Omit<Todo, "id">;
