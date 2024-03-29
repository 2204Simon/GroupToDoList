import { useParams } from 'react-router-dom'
import {
  completeTodo,
  createTodo,
  deleteTodo,
  loadTodos,
  updateTodo,
} from './todofunctions'
import { useState } from 'react'

export default function SingleToDoList() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
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
            create LocalDatabases
          </button>{' '}
          <br />
          <button
            onClick={async () => {
              const todos = await loadTodos('testtodo')
              console.log(todos)
            }}
          >
            load LocalDatabases
          </button>{' '}
          <br />
          <button
            onClick={() =>
              deleteTodo('testtodo', 'fea10ebb-f17d-4fb6-b58e-07f1d641995c')
            }
          >
            delete LocalDatabases
          </button>{' '}
          <br />
          <button
            onClick={() =>
              updateTodo('testtodo', 'eded3bbb-09a2-474b-8c0b-3c8f6ad8afff', {
                title: 'Updated',
                description: 'Updated',
                completed: true,
              })
            }
          >
            update LocalDatabases
          </button>{' '}
          <br />
          <button
            onClick={() =>
              completeTodo(
                'testtodo',
                'cd0a6a6e-bd9d-4f14-a6ff-1593530d5bda',
                true,
              )
            }
          >
            complete LocalDatabases
          </button>
        </>
      )}
    </div>
  )
}
