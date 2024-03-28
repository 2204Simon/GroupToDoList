import React, { useState } from 'react'
import { Todo, TodoListItemProps } from '../types/types'

interface TodoListItemActions {
  onDelete: (id: string) => void,
  onEdit: (id: string, updatedTodo: Todo) => void;
}

const TodoListItem: React.FC<TodoListItemProps & TodoListItemActions> = ({
  todo,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTodo, setUpdatedTodo] = useState(todo);

  const handleDelete = () => {
    onDelete(todo._id)
  }

  const handleEdit = () => {
    if (isEditing) {
      onEdit(todo._id, updatedTodo)
    }
    setIsEditing(!isEditing);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTodo({ ...updatedTodo, [event.target.name]: event.target.value });
  }

  return (
    <div>
      {isEditing ? (
        <>
          <input type="text" name="title" value={updatedTodo.title} onChange={handleChange} />
          <input type="text" name="description" value={updatedTodo.description} onChange={handleChange} />
        </>
      ) : (
        <>
          <strong>{todo.title}</strong>: {todo.description}{' '}
        </>
      )}
      <button onClick={handleDelete}>Löschen</button>
      <button onClick={handleEdit}>{isEditing ? 'Speichern' : 'Bearbeiten'}</button>
    </div>
  )
}

export default TodoListItem