// src/components/TodoList.tsx
import React from 'react'
import { Todo, TodoListProps } from '../types/types'
import TodoListItem from './ToDoListItem'
import { completeTodo, deleteTodo } from './todofunctions'

interface TodoListActions {
  // onDelete: (id: string) => void
  // onEdit: (id: string, updatedTodo: Todo) => void
  // onComplete: (id: string, isCompleted: boolean) => void
  groupListId: string
}

const TodoList: React.FC<TodoListProps & TodoListActions> = ({
  todos,
  groupListId,
}) => {
  function onComplete(id: string, isCompleted: boolean) {
    completeTodo(groupListId, id, isCompleted)
  }
  function onDelete(id: string) {
    deleteTodo(groupListId, id)
  }
  function onEdit(id: string, updatedTodo: Todo) {
    console.log('onEdit', id, updatedTodo)
  }
  return (
    <div>
      {todos.map((todo) => (
        <TodoListItem
          key={todo._id}
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
