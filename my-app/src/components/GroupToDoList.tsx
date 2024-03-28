import React from 'react'
import TodoList from './ToDoList'
import { ToDoListsProps } from '../types/types'

const GroupToDoList: React.FC<ToDoListsProps> = ({
  todos,
  newTodo,
  setNewTodo,
  addTodo,
  deleteTodo,
}) => {
  return (
    <>
      <TodoList todos={todos} onDelete={deleteTodo} />
      {/* <TodoList todos={todos} onDelete={deleteTodo} title={''} /> */}

      <form onSubmit={addTodo}>
        <label htmlFor="title">Titel:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          required
        />

        <label htmlFor="description">Beschreibung:</label>
        <textarea
          id="description"
          name="description"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
          required
        />

        <button type="submit">To-Do hinzufügen</button>
      </form>
    </>
  )
}

export default GroupToDoList
