import React, { useState, useEffect } from 'react'
import { Todo } from './types/types'
import TodoList from './components/ToDoList'
import CreateDatabase from './components/addList'

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState({ title: '', description: '' })

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      const response = await fetch('http://localhost:4001/api/todos', {
        credentials: 'include',
      })
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        setTodos(data)
      }
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

  return (
    <div>
      <h1>Gruppen To-Do-Verwaltung</h1>

      <TodoList todos={todos} onDelete={deleteTodo} />
      <CreateDatabase />
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

        <button type="submit">To-Do hinzufügen</button>
      </form>
    </div>
  )
}

export default App
