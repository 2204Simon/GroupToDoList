import React, { useState } from 'react'
import { Todo, TodoListItemProps } from '../types/types'
import { FaCheck, FaTimes } from 'react-icons/fa'; 

interface TodoListItemActions {
  onDelete: (id: string) => void,
  onEdit: (id: string, updatedTodo: Todo) => void;
  onComplete: (id: string, isCompleted: boolean) => void;
}

const TodoListItem: React.FC<TodoListItemProps & TodoListItemActions> = ({
  todo,
  onDelete,
  onEdit,
  onComplete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTodo, setUpdatedTodo] = useState(todo);
  const [isCompleted, setIsCompleted] = useState(todo.completed); // Zustand für erledigte Todos

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

  const handleToggle = () => { // Funktion zum Umschalten des erledigten Zustands
    setIsCompleted(!isCompleted);
    onComplete(todo._id, !isCompleted);
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
      <button onClick={handleToggle}> 
        {isCompleted ? <FaCheck /> : <FaTimes />} 
      </button>
    </div>
  )
}

export default TodoListItem