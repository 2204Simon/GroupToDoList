import React, { useState, useEffect } from 'react'
import {GroupTodoList} from './types/types'

const App: React.FC = () => {
  const [newTodoList, setNewTodoList] = useState({ title: '' })
  const [todoLists, setTodoLists] = useState<GroupTodoList[]>([])

  useEffect(() => {
    loadTodoLists()
  }, [])

  const loadTodoLists = async () => {
    try {
      const response = await fetch('http://localhost:4001/todolists')
      const data = await response.json()
      const todoLists = data.map((todoList: { id: string; title: string }) => ({
        id: todoList.id,
        title: todoList.title,
      }))
      setTodoLists(todoLists)
      console.log(todoLists)
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
        body: JSON.stringify(newTodoList),
      })

      if (response.ok) {
        console.log('Todo-Liste erfolgreich erstellt')
        loadTodoLists()
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

      {todoLists.map((list, index) => (
        <div key={index}>{list.title}</div>
      ))}
    </div>
  )
}

export default App