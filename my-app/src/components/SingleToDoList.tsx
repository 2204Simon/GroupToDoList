import React from 'react'
import { useParams } from 'react-router-dom'

export default function SingleToDoList() {
  const { id } = useParams()
  return <div>SingleToDoList Nummer {id}</div>
}
