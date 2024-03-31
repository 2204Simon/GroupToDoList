import { useParams } from 'react-router-dom'
import {
  createTodo,
  findRoleForTodoList,
  getGroupListName,
  loadTodos,
} from './todofunctions'
import PouchDB from 'pouchdb-browser'
import { useEffect, useState } from 'react'
import { Todo } from '../types/types'
import TodoList from './ToDoList'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function SingleToDoList() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [label, setLabel] = useState('Hohe Priorität')
  const [userRole, setUserRole] = useState('admin')
  const [groupListTitle, setGroupListTitle] = useState('')
  const [cookies] = useCookies(['database'])
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const [dueDate, setDueDate] = useState<Date>(tomorrow)
  const [todos, setTodos] = useState<Array<Todo>>([])
  const [cookie, setCookie] = useCookies(['database'])

  const [role, setRole] = useState('')
  useEffect(() => {
    loadTodos(id as string)
      .then((todos) => {
        setTodos(todos)
      })
      .catch(console.error)
  }, [id, todos])

  useEffect(() => {
    const localDB = new PouchDB(id)
    const remoteDB = new PouchDB(
      `http://${encodeURIComponent('admin')}:${encodeURIComponent('12345')}@localhost:5984/${id}`,
    )
    const syncDatabases = async (
      localDB: PouchDB.Database,
      remoteDB: PouchDB.Database,
    ) => {
      console.log('syncing databases')
      await localDB.sync(remoteDB, {
        live: false,
        retry: true,
      })
      console.log('databases synced')
    }
    syncDatabases(localDB, remoteDB).then(() => {
      getGroupListName(id as string, cookie)
        .then((title) => {
          console.log(title)

          setGroupListTitle(title)
        })
        .catch((error) => console.error('error', error))
      findRoleForTodoList(id as string, cookie)
        .then((role: string) => {
          console.log(role, 'role users')
          setRole(role)
        })
        .catch(console.error)
    })
  }, [id, cookie])

  return (
    <div>
      {!id ? (
        <div>Keine ID gefunden</div>
      ) : (
        <>
          <h1>{groupListTitle}</h1>
          <br />
          {(role === 'admin' || role === 'bearbeiter') && (
            <>
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
              {role === 'admin' && (
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Zugewiesen an"
                />
              )}
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                defaultValue={'Hohe Priorität'}
              >
                <option value="Hohe Priorität">Hohe Priorität</option>
                <option value="Mittlere Priorität">Mittlere Priorität</option>
                <option value="Niedrige Priorität">Niedrige Priorität</option>
              </select>
              {role === 'admin' && (
                <ReactDatePicker
                  selected={dueDate}
                  onChange={(date: Date) => {
                    date.setUTCHours(0, 0, 0, 0)
                    setDueDate(date)
                  }}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Fälligkeitsdatum"
                />
              )}
              <button
                onClick={async () => {
                  if (title === '' || description === '') {
                    toast.error(
                      'Titel und Beschreibung dürfen nicht leer sein',
                      {
                        autoClose: 2000,
                      },
                    )
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
            </>
          )}
          {role === 'admin' && (
            <>
              <h1>Person hinzufügen</h1>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <select
                value={label}
                onChange={(e) => setUserRole(e.target.value)}
                defaultValue={'admin'}
              >
                <option value="admin">Admin</option>
                <option value="bearbeiter">Bearbeiter</option>
                <option value="leser">Leser</option>
              </select>
              <button
                onClick={async () => {
                  console.log(email, userRole, groupListTitle, id)
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
                    const response = await fetch(
                      'http://localhost:4001/api/inviteTodoLists',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          email,
                          role: userRole, // Sie müssen diese Variable definieren
                          title: groupListTitle, // Sie müssen diese Variable definieren
                          groupListId: id, // Sie müssen diese Variable definieren
                        }),
                        credentials: 'include',
                      },
                    )

                    if (!response.ok) {
                      toast.error('Fehler beim Hinzufügen der Person', {
                        autoClose: 2000,
                      })
                    } else if (response.status === 200) {
                      toast.success('Person hinzugefügt', { autoClose: 2000 })
                    }
                  }
                }}
              >
                Person hinzufügen
              </button>
            </>
          )}
          <TodoList todos={todos} groupListId={id} />
        </>
      )}
    </div>
  )
}
