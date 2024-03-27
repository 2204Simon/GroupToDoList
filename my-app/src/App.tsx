import React, { useState, useEffect } from 'react'
import { Todo, GroupTodoList, TodoListProps } from './types/types'
import GroupToDoList from './components/GroupToDoList'

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState({ title: '', description: '' })
  const [newTodoList, setNewTodoList] = useState({ title: '' })
  const [todoLists, setTodoLists] = useState<GroupTodoList[]>([])

  useEffect(() => {
    loadTodos()
  }, [])

  useEffect(() => {
    loadTodoLists()
  }, [])

  const loadTodoLists = async () => {
    try {
      const response = await fetch('http://localhost:4001/todolists')
      const data = await response.json()
      setTodoLists(data)
    } catch (error) {
      console.error(error)
    }
  }

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

  const addTodoList = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch('http://localhost:4001/todolists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodoList), // Senden Sie nur den Titel der Todo-Liste
      })

      if (response.ok) {
        console.log('Todo-Liste erfolgreich erstellt')
      } else {
        const errorData = await response.json()
        console.log(
          'Es gab ein Problem beim Erstellen der Todo-Liste:',
          errorData.error,
        )
      }
    } catch (error) {
      console.error('Es gab einen Fehler beim Senden der Anforderung', error)
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
      <form onSubmit={addTodoList}>
        <label htmlFor="title">Titel:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={newTodoList.title}
          onChange={(e) =>
            setNewTodoList({ ...newTodoList, title: e.target.value })
          }
          required
        />
        <button type="submit">To-Do Liste erstellen</button>
      </form>
      //noch bugs
      {todoLists.map((list, index) => (
        <div key={index}>{list.title}</div>
      ))}
      <GroupToDoList
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
