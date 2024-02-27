export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface TodoListProps {
  todos: Todo[];
}

export interface TodoListItemProps {
  todo: Todo;
}
