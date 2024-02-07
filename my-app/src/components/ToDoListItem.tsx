import React from "react";
import { Todo } from "../types/types";

interface TodoListItemProps {
  todo: Todo;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ todo }) => {
  return <li>{todo.text}</li>;
};

export default TodoListItem;
