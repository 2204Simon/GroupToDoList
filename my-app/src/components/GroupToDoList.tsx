import React from 'react'
import {useEffect, useState} from 'react'
import TodoList from './ToDoList'
import { ToDoListsProps, Todo } from '../types/types'
import { Plus } from 'phosphor-react'
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GroupToDoList: React.FC<ToDoListsProps> = ({
}) => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState({ title: '', description: '', assignedTo: '', completed: false, label: 'höhere Priorität', dueDate: new Date()})

  useEffect(() => {
    loadTodos()
  }, [])
  
  const loadTodos = async () => {
    try {
      const response = await fetch('http://localhost:4001/api/todos')
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error(error)
    }
  }
  const addTodo = async (event: React.FormEvent) => {
    event.preventDefault()
  
    
  
    try {
      await fetch('http://localhost:4001/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newTodo),
      })
  
      loadTodos()
      setNewTodo({ title: '', description: '', assignedTo: '', completed: false, label: 'höhere Priorität', dueDate: new Date()})
    } catch (error) {
      console.error(error)
    }
  }
  const deleteTodo = async (id: string) => {
    try {
      await fetch(`http://localhost:4001/api/todos/${id}`, {
        method: 'DELETE',
      })

      loadTodos()
    } catch (error) {
      console.error(error)
    }
  }

  const editTodo = async (id: string, updatedTodo: Todo) => {
    try {
      await fetch(`http://localhost:4001/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      })
  
      loadTodos()
    } catch (error) {
      console.error(error)
    }
  }

  const completeTodo = async (id: string, isCompleted: boolean) => {
    try {
      await fetch(`http://localhost:4001/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: isCompleted }),
      })
  
      loadTodos()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <TodoList todos={todos} deleteTodo={deleteTodo} editTodo={editTodo} onComplete={completeTodo} />

      <form onSubmit={addTodo}>
        <label htmlFor="title">Titel:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          required
        />

        <label htmlFor="description">Beschreibung:</label>
        <textarea
          id="description"
          name="description"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
          required
        />

        <label htmlFor="assignedTo">Zugewiesen an:</label>
        <input
          type="text"
          id="assignedTo"
          name="assignedTo"
          value={newTodo.assignedTo}
          onChange={(e) =>
            setNewTodo({ ...newTodo, assignedTo: e.target.value })
          }
        />
        <label htmlFor="label">Label:</label>
        
<select
  id="label"
  name="label"
  value={newTodo.label} // Nehmen Sie an, dass label ein String ist
  onChange={(e) =>
    setNewTodo({ ...newTodo, label: e.target.value }) // Setzen Sie den ausgewählten Wert direkt
  }
  defaultValue={'Hohe Priorität'} // Standardwert
>
  <option value="Hohe Priorität">Hohe Priorität</option>
  <option value="Mittlere Priorität">Mittlere Priorität</option>
  <option value="Niedrige Priorität">Niedrige Priorität</option>
</select>
<label htmlFor="dueDate">Fälligkeitsdatum:</label>
<ReactDatePicker
  id="dueDate"
  name="dueDate"
  selected={newTodo.dueDate}
  onChange={(date: Date) => {
    date.setUTCHours(0, 0, 0, 0);
    setNewTodo({ ...newTodo, dueDate: date });
  }}
  dateFormat="dd.MM.yyyy"
  placeholderText='Fälligkeitsdatum'
/>


        <button type="submit"><Plus size={30} /></button>
      </form>
    </>
  )
}

export default GroupToDoList
