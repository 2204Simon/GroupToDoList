import { useParams } from 'react-router-dom'
import {
  createTodo,
  loadTodos,
} from './todofunctions'
import { useEffect, useState } from 'react'
import { Todo } from '../types/types'
import TodoList from './ToDoList'

export default function SingleToDoList() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [label, setLabel] = useState('Hohe Priorität')
  const [todos, setTodos] = useState<Array<Todo>>([])
  
  useEffect(() => {
    loadTodos(id as string)
      .then((todos) => {
        setTodos(todos)
      })
      .catch(console.error)
  }, [id])

  useEffect(() => {
    loadTodos(id as string)
      .then((todos) => {
        setTodos(todos)
      })
      .catch(console.error)
  }, [todos])

  return (
    <div>
      {!id ? (
        <div>Keine ID gefunden</div>
      ) : (
        <>
          <div>SingleToDoList Nummer {id}</div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="To-Do Titel"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung"
          />
          <input
          type='text'
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder='Zugewiesen an'
        />
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          defaultValue={'Hohe Priorität'}
          
        >
          <option value='Hohe Priorität'>Hohe Priorität</option>
          <option value='Mittlere Priorität'>Mittlere Priorität</option>
          <option value='Niedrige Priorität'>Niedrige Priorität</option>
        </select>
          <button
            onClick={async () => {
              const newTodo = await createTodo(id, title, description, assignedTo, false, label)
              setTodos(prevTodos => [...prevTodos, newTodo])
            }}
          >
            Todo hinzufügen
          </button>{' '}
          
          <br />
          <TodoList todos={todos} groupListId={id} />
        </>
      )}
    </div>
  )
}