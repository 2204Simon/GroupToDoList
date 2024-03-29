import { useParams } from 'react-router-dom'
import { createTodo } from './todofunctions'

export default function SingleToDoList() {
  const { id } = useParams()

  return (
    <div>
      <div>SingleToDoList Nummer {id}</div>
      <button onClick={() => createTodo('testtodo', 'hallo')}>
        test LocalDatabases
      </button>
    </div>
  )
}
