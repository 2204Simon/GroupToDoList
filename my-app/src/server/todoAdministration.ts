import express from 'express'
import { couch } from './server.ts'
import { v4 as uuidv4 } from 'uuid'
import { getUserIdFromToken } from './jwtMiddleware.ts'

const todoDbName = 'todo' // Change this to your todo database name

export const TodoAdministration = express.Router()
// Handle POST request on /todo route
TodoAdministration.post('/todos', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.cookies.token)
    const { title, permissions } = req.body
    const todo = await couch.insert(todoDbName, {
      title,
      userId,
      permissions, // This could be an object with userIds as keys and permissions as values
      todoId: uuidv4(),
    })
    res.json(todo.data)
  } catch (err) {
    console.error(err, 'error!!!!!!')
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Handle GET request on /todo route
TodoAdministration.get('/todos', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.cookies.token)
    const todos = await couch.mango(todoDbName, {
      selector: {
        userId: userId,
      },
    })

    if (todos.data.docs.length === 0) {
      return res.status(400).json({ error: 'No todos found for this user' })
    }

    res.json(todos.data.docs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
