import express from 'express'
import { couch } from './server.ts'

const todoDbName = 'todo' // Change this to your todo database name

export const TodoDatabaseCreation = express.Router()

TodoDatabaseCreation.post('/groupTodoLists', async (req, res) => {
  try {
    const userId = req.cookies.token
    const dbName = req.body.dbName || todoDbName
    const response = await couch.createDatabase(dbName)
    if (response.ok) {
      // Set user as admin for the new database
      const db = couch.use(dbName)
      const security = await db.get('_security')
      security.admins.names.push(userId)
      await db.insert(security, '_security')

      res.json({ message: `Database ${dbName} created successfully` })
    } else {
      res.status(500).json({ error: 'Failed to create database' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

TodoDatabaseCreation.get('/groupTodoLists', async (req, res) => {
  try {
    const userId = req.cookies.token
    const dbList = await couch.db.list() // get list of all databases
    const userDbs = []

    for (const dbName of dbList) {
      const db = couch.use(dbName)
      const security = await db.get('_security')

      // check if user has any rights on the database
      if (
        security.members.names.includes(userId) ||
        security.admins.names.includes(userId)
      ) {
        userDbs.push(dbName)
      }
    }

    res.json(userDbs) // send list of databases user has rights on
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while fetching user databases.')
  }
})
