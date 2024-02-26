import React, { useState } from "react";
import { Todo } from "../types/types";
import TodoListItem from "../components/ToDoListItem";
import { Plus } from "phosphor-react";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = async () => {
    const newTodo = { text: inputValue, id: Date.now() };

    // Senden Sie eine POST-Anforderung an Ihren Server
    const response = await fetch("http://localhost:4001/api/addToDo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });

    // Überprüfen Sie, ob die Anforderung erfolgreich war
    if (response.ok) {
      // Fügen Sie das neue Todo zur lokalen Liste hinzu
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInputValue("");
    } else {
      console.error("Fehler beim Hinzufügen des Todos:", response.statusText);
    }
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
