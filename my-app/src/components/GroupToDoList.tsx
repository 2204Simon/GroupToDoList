import React from 'react'
import {useEffect, useState} from 'react'
import TodoList from './ToDoList'
import { ToDoListsProps, Todo } from '../types/types'
import { Plus } from 'phosphor-react'

const GroupToDoList: React.FC<ToDoListsProps> = ({
}) => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState({ title: '', description: '' })

  useEffect(() => {
    loadTodos()
  }, [])
  const loadTodos = async () => {
    try {
      const response = await fetch('http://localhost:4001/todos')
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error(error)
    }
  }
  const addTodo = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      await fetch('http://localhost:4001/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newTodo),
      })

      loadTodos()
      setNewTodo({ title: '', description: '' })
    } catch (error) {
      console.error(error)
    }
  }
  const deleteTodo = async (id: string) => {
    try {
      await fetch(`http://localhost:4001/todos/${id}`, {
        method: 'DELETE',
      })

      loadTodos()
    } catch (error) {
      console.error(error)
    }
  }

  const editTodo = async (id: string, updatedTodo: Todo) => {
    try {
      await fetch(`http://localhost:4001/todos/${id}`, {
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
      await fetch(`http://localhost:4001/todos/${id}`, {
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
      <TodoList todos={todos} onDelete={deleteTodo} onEdit={editTodo} onComplete={completeTodo}/>

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

        <button type="submit"><Plus size={30} /></button>
      </form>
    </>
  )
}

export default GroupToDoList
