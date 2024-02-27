import React from "react";
import { TodoListItemProps } from "../types/types";

interface TodoListItemActions {
  onDelete: (id: string) => void;
}

const TodoListItem: React.FC<TodoListItemProps & TodoListItemActions> = ({
  todo,
  onDelete,
}) => {
  const handleDelete = () => {
    onDelete(todo._id);
  };

  return (
    <div>
      <strong>{todo.title}</strong>: {todo.description}{" "}
      <button onClick={handleDelete}>Löschen</button>
    </div>
  );
};

export default TodoListItem;
