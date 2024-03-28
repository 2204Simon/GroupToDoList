// src/components/TodoList.tsx
import React from 'react'
import { Todo, TodoListProps } from '../types/types'
import TodoListItem from './ToDoListItem'

interface TodoListActions {
  onDelete: (id: string) => void
  onEdit: (id: string, updatedTodo: Todo) => void;
}

const TodoList: React.FC<TodoListProps & TodoListActions> = ({
  todos,
  onDelete,
  onEdit,
}) => {
  return (
    <div>
      {todos.map((todo) => (
        <TodoListItem key={todo._id} todo={todo} onDelete={onDelete} onEdit={onEdit}/>
      ))}
    </div>
  )
}

export default TodoList
