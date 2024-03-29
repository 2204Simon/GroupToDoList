import React from 'react'
import { useParams } from 'react-router-dom'
import { loadTodoLists } from './loadTodos'

export default function SingleToDoList() {
  const { id } = useParams()

  return (
    <div>
      <div>SingleToDoList Nummer {id}</div>
      <button onClick={loadTodoLists}>test LocalDatabases</button>
    </div>
  )
}
