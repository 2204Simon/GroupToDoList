import { useParams } from 'react-router-dom'
import { createTodo, loadTodos } from './todofunctions'
import { useEffect, useState } from 'react'
import { Todo } from '../types/types'
import TodoList from './ToDoList'
import { toast } from 'react-toastify'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function SingleToDoList() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [label, setLabel] = useState('Hohe Priorität')
  const [userRole, setuUserRole] = useState('Admin')
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const [dueDate, setDueDate] = useState<Date>(tomorrow)
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
          <h1>SingleToDoList Nummer {id}</h1>
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
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Zugewiesen an"
          />
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            defaultValue={'Hohe Priorität'}
          >
            <option value="Hohe Priorität">Hohe Priorität</option>
            <option value="Mittlere Priorität">Mittlere Priorität</option>
            <option value="Niedrige Priorität">Niedrige Priorität</option>
          </select>
          <ReactDatePicker
            selected={dueDate}
            onChange={(date: Date) => {
              date.setUTCHours(0, 0, 0, 0)
              setDueDate(date)
            }}
            dateFormat="dd.MM.yyyy"
            placeholderText="Fälligkeitsdatum"
          />
          <button
            onClick={async () => {
              if (title === '' || description === '') {
                toast.error('Titel und Beschreibung dürfen nicht leer sein', {
                  autoClose: 2000,
                })
              } else {
                const newTodo = await createTodo(
                  id,
                  title,
                  description,
                  assignedTo,
                  false,
                  label,
                  dueDate as Date,
                )
                setTodos((prevTodos) => [...prevTodos, newTodo])
                toast.success('To-Do hinzugefügt', { autoClose: 2000 })
              }
            }}
          >
            Todo hinzufügen
          </button>{' '}
          <br />
          <h1>Person hinzufügen</h1>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            defaultValue={'Hohe Priorität'}
          >
            <option value="Admin">Admin</option>
            <option value="Bearbeiter">Bearbeiter</option>
            <option value="Leser">Leser</option>
          </select>
          <button
            onClick={async () => {
              if (navigator.onLine === false) {
                toast.error('Diese funktion nur mit Internetverbindung', {
                  autoClose: 2000,
                })
              }
              if (email === '') {
                toast.error('Email darf nicht leer sein', {
                  autoClose: 2000,
                })
              } else {
                const newTodo = await createTodo(
                  id,
                  title,
                  description,
                  assignedTo,
                  false,
                  label,
                  dueDate as Date,
                )
                setTodos((prevTodos) => [...prevTodos, newTodo])
                toast.success('To-Do hinzugefügt', { autoClose: 2000 })
              }
            }}
          >
            Person hinzufügen
          </button>
          <TodoList todos={todos} groupListId={id} />
        </>
      )}
    </div>
  )
}
