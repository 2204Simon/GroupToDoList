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
  const [caption, setCaption] = useState('')
  const [todos, setTodos] = useState<Array<Todo>>([])
  useEffect(() => {
    loadTodos(id as string)
      .then((todos) => {
        console.log(todos)
        setTodos(todos)
      })
      .catch(console.error)
  }, [id])
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
            placeholder="Title"
          />
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption"
          />
          <button onClick={() => createTodo(id, title, caption, false)}>
            create Todo
          </button>{' '}
          <br />
          <button
            onClick={async () => {
              const todos = await loadTodos(id as string)
              console.log(todos)
            }}
          >
            load Todos
          </button>{' '}
          <br />
          <TodoList todos={todos} groupListId={id} />
        </>
      )}
    </div>
  )
}