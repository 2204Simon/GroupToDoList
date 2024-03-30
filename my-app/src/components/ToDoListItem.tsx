import React, { useState } from 'react'
import { Todo, TodoListItemProps } from '../types/types'
import { FaCheck, FaTimes } from 'react-icons/fa'; 
import { Pen, FloppyDisk, Trash } from 'phosphor-react';

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
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: isCompleted ? 'gray' : 'black'}}>
      <div style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
        {isEditing ? (
          <>
            <input type="text" name="To-Do Titel" value={updatedTodo.title} onChange={handleChange} />
            <input type="text" name="Beschreibung" value={updatedTodo.description} onChange={handleChange} />
          </>
        ) : (
          <>
            <strong>{todo.title}</strong>: {todo.description}{' '}
          </>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '30%', minWidth: '200px' }}>
        {!isEditing && (
          <button style={{width: 'auto'}} onClick={handleToggle}> 
            {isCompleted ? <FaCheck size={30} /> : <FaTimes size={30} />} 
          </button>
        )}
        <div style={{ display: 'flex' }}>
          <button style={{width: 'auto', marginLeft: '10px'}} onClick={handleEdit}>
            {isEditing ? <FloppyDisk size={30}/> : <Pen size={30}/>}
          </button>
          {!isEditing && (
            <button style={{width: 'auto', marginLeft: '10px'}} onClick={handleDelete}><Trash size={30}/></button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoListItem