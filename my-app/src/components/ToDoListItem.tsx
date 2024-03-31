import React, { useState } from 'react'
import { Todo, TodoListItemProps } from '../types/types'
import { FaCheck, FaTimes } from 'react-icons/fa'; 
import { Pen, FloppyDisk, Trash } from 'phosphor-react';
import { toast } from 'react-toastify';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const [role, setRole] = useState('')
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
    toast.error('To-Do gelöscht');
    onDelete(todo._id)
  }

  const handleEdit = () => {
    if (isEditing) {
      onEdit(todo._id, updatedTodo)
    }
    toast.info(`To-Do ${isEditing ? 'aktualisiert' : 'bearbeiten'}`);
    setIsEditing(!isEditing);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (event.target.name === 'dueDate') {
      const date = new Date(event.target.value);
      date.setUTCHours(0, 0, 0, 0);
      setUpdatedTodo({ ...updatedTodo, [event.target.name]: date });
    } else {
      setUpdatedTodo({ ...updatedTodo, [event.target.name]: event.target.value });
    }
  }
 

  const handleToggle = () => { // Funktion zum Umschalten des erledigten Zustands
    toast.success(`To-Do ${isCompleted ? 'wiederhergestellt' : 'erledigt'}`);
    setIsCompleted(!isCompleted);
    onComplete(todo._id, !isCompleted);
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: isCompleted ? 'gray' : 'black'}}>
      <div style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
        {isEditing ? (
          <>
            <input type="text" name="title" value={updatedTodo.title} onChange={handleChange} placeholder='To-Do Titel' />
            <input type="text" name="description" value={updatedTodo.description} onChange={handleChange} placeholder='Beschreibung'/>
            <input type="text" name="assignedTo" value={updatedTodo.assignedTo} onChange={handleChange} placeholder='Zugewiesen an'/>
            <ReactDatePicker
  selected={updatedTodo.dueDate}
  onChange={(date: Date) => {
    date.setUTCHours(0, 0, 0, 0);
    setUpdatedTodo({ ...updatedTodo, dueDate: date });
  }}
  dateFormat="dd.MM.yyyy"
  placeholderText='Fälligkeitsdatum'
/>
            <select
              name="label"
              value={updatedTodo.label}
              onChange={handleChange}
              defaultValue={'Hohe Priorität'}
            >

            <option value="Hohe Priorität">Hohe Priorität</option>
            <option value="Mittlere Priorität">Mittlere Priorität</option>
            <option value="Niedrige Priorität">Niedrige Priorität</option>
          </select>

          </>
        ) : (
          <>
          
          <strong>Titel: {todo.title}</strong>
<br />
Beschreibung: {todo.description}
<br />
Zugewiesen an: {todo.assignedTo}
<br />
Label: {todo.label}
<br />
Fälligkeitsdatum: {todo.dueDate ? (new Date(todo.dueDate).toLocaleDateString('de-DE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})) : ''}
          </>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '30%', minWidth: '200px' }}>
      <div style={{ display: 'flex' }}>
        {!isEditing && (
          <button style={{width: 'auto', marginRight: '10px'}} onClick={handleToggle}> 
            {isCompleted ? <FaCheck size={30} /> : <button style={{width: '30px', height: '30px'}} />} 
          </button>
        )}
        {(role === 'admin' || role === 'bearbeiter') && (
          <button style={{width: 'auto', marginLeft: '10px'}} onClick={handleEdit}>
            {isEditing ? <FloppyDisk size={30}/> : <Pen size={30}/>}
          </button>
        )}
        {(role === 'admin' || role === 'bearbeiter') && !isEditing && (
          <button style={{width: 'auto', marginLeft: '10px'}} onClick={handleDelete}><Trash size={30}/></button>
        )}
      </div>
    </div>
  </div>
)
}

export default TodoListItem