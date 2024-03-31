import React, { useState, useEffect } from 'react'
import { GroupTodoList } from '../types/types'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AllGroupToDoLists: React.FC = () => {
  const [newTodoList, setNewTodoList] = useState({ title: '' })
  const [todoLists, setTodoLists] = useState<GroupTodoList[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    loadTodoLists()
  }, [])

  const loadTodoLists = async () => {
    try {
      // if (localStorage.getItem('database') === null) {
      //   // sie müssen sich anmelden um eine todo liste zu erstellen
      //   toast.error('Sie müssen sich anmelden um Ihre To-Do-Listen einzusehen!')
      //   navigate('/login')
      //   return
      // }
      const response = await fetch('http://localhost:4001/api/todolists', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
  
      if (!response.ok) {
        console.error(`Server responded with status code ${response.status}`)
        return
      }
  
      const data = await response.json()
      console.log('data', data);
  
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
      // if (localStorage.getItem('database') === null) {
      //   // sie müssen sich anmelden um eine todo liste zu erstellen
      //   toast.error('Sie müssen sich anmelden um eine To-Do-Liste zu erstellen!')
      //   navigate('/login')
      //   return
      // }
      
      const response = await fetch('http://localhost:4001/api/todolists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodoList),
        credentials: 'include',
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

export default AllGroupToDoLists
