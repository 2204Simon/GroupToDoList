import express from 'express'
import NodeCouchDb from 'node-couchdb'
import dotenv from 'dotenv'
import cors from 'cors'
import { UserAdministrationRouter } from './usersAdministration.ts'
import bodyParser from 'body-parser';
import { checkAndCreateDatabases } from './couchUtilities.ts'
import { TodoAdministration } from './todoAdministration.ts'


dotenv.config()


export const couch = new NodeCouchDb({
  auth: {
    user: process.env.COUCHDB_USER,
    pass: process.env.COUCHDB_PASSWORD,
  },
  host: 'localhost',
  protocol: 'http',
  port: 5984,
})

const dbName = 'db'
const todoDbName = 'todo';
const dbNameUsers = 'users'
const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,
}

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use("/api/",UserAdministrationRouter, TodoAdministration)
app.use(express.json())
checkAndCreateDatabases(couch, [dbName, dbNameUsers, todoDbName])

// Beispiel-Endpunkt zum Abrufen aller To-Dos
app.get('/todos', async (req, res) => {
  try {
    const todos = await couch.mango(dbName, {
      selector: {},
    })
    res.json(todos.data.docs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Beispiel-Endpunkt zum Erstellen eines neuen To-Dos
app.post('/todos', async (req, res) => {
  try {
    const { title, description } = req.body
    const todo = await couch.insert(dbName, {
      title,
      description,
      completed: false,
    })
    res.json(todo.data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.delete('/todos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const todo = await couch.get(dbName, id)
    if (todo.data._id) {
      const deletedTodo = await couch.del(dbName, todo.data._id, todo.data._rev)
      res.json(deletedTodo.data)
    } else {
      res.status(404).json({ error: 'To-Do not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(4001, () => console.log('Server is running on port 4001'))
