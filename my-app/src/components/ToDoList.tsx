// src/components/TodoList.tsx
import React from "react";
import { TodoListProps } from "../types/types";
import TodoListItem from "./ToDoListItem";

interface TodoListActions {
  // onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps & TodoListActions> = ({
  todos,
  // onDelete,
}) => {
  return (
    <div>
      {todos.map((todo) => (
        // <TodoListItem key={todo._id} todo={todo} onDelete={onDelete} />
        <TodoListItem key={todo._id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;
