// src/components/TodoList.tsx
import React from 'react'
import { Todo, TodoListProps } from '../types/types'
import TodoListItem from './ToDoListItem'
import { completeTodo, deleteTodo, updateTodo } from './todofunctions'

interface TodoListActions {
  groupListId: string
  role: string
}

const TodoList: React.FC<TodoListProps & TodoListActions> = ({
  todos,
  groupListId,
  role,
}) => {
  function onComplete(id: string, isCompleted: boolean) {
    completeTodo(groupListId, id, isCompleted)
  }
  function onDelete(id: string) {
    deleteTodo(groupListId, id)
  }
  function onEdit(id: string, updatedTodo: Todo) {
    updateTodo(groupListId, id, updatedTodo)
  }
  return (
    <div>
      {todos
        .filter((todo) => todo._id !== undefined)
        .map((todo) => (
          <TodoListItem
            key={todo._id}
            role={role}
            todo={todo}
            onDelete={onDelete}
            onEdit={onEdit}
            onComplete={onComplete}
          />
        ))}
    </div>
  )
}

export default TodoList
