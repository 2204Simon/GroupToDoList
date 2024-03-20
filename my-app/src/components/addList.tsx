import React, { useState } from 'react'

function CreateDatabase() {
  const [dbName, setDbName] = useState('')

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    try {
      const response = await fetch('http://localhost:4001/api/groupTodoLists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dbName }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to create database')
      }

      const data = await response.json()
      alert(data.message)
    } catch (error) {
      console.error(error)
      alert('An error occurred while creating the database.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Database Name:
        <input
          type="text"
          value={dbName}
          onChange={(e) => setDbName(e.target.value)}
          required
        />
      </label>
      <button type="submit">Create Database</button>
    </form>
  )
}

export default CreateDatabase
