import React, { useState, useEffect } from 'react'
import { Todo } from './types/types'
import TodoList from './components/ToDoList'
import ToDoLists from './components/ToDoLists'

const App: React.FC = () => {
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

      <ToDoLists
        todos={todos}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        addTodo={addTodo}
        deleteTodo={deleteTodo}
      />
    </div>
  )
}

export default App
