import React, { useState } from "react";
import { Todo } from "../types/types";
import TodoListItem from "../components/ToDoListItem";
import { Plus } from "phosphor-react";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    const newTodo = { id: Date.now(), text: inputValue };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setInputValue("");
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={addTodo}>
        <Plus />
      </button>
      <ul>
        {todos.map((todo) => (
          <TodoListItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
