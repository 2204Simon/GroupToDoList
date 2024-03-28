import express from 'express'
import NodeCouchDb from 'node-couchdb'
import dotenv from 'dotenv'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()
const couch = new NodeCouchDb({
  auth: {
    user: process.env.COUCHDB_USER,
    pass: process.env.COUCHDB_PASSWORD,
  },
  host: 'localhost',
  protocol: 'http',
  port: 5984,
})

const dbName = 'db'
const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())

couch.listDatabases().then((dbs: string[]) => {
  if (dbs.includes(dbName)) {
    console.log('Datenbank existiert bereits')
  } else {
    couch.createDatabase(dbName).then(
      () => {
        console.log('Datenbank erfolgreich erstellt')
      },
      (err: Error) => {
        console.error(err)
      },
    )
  }
})

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
// Endpunkt zum Erstellen einer neuen Todo-Liste

app.post('/todolists', async (req, res) => {
  try {
    const id = uuidv4() // Generieren Sie eine eindeutige ID
    const dbName = `db_${id}`

    const dbs = await couch.listDatabases()
    if (dbs.includes(dbName)) {
      res.status(400).json({ error: 'Todo-Liste existiert bereits' })
    } else {
      await couch.createDatabase(dbName)
      res.json({ message: 'Todo-Liste erfolgreich erstellt', id }) // Senden Sie die ID zurück
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Endpunkt zum Abrufen aller Todo-Listen
app.get('/todolists', async (req, res) => {
  try {
    const dbs = await couch.listDatabases()
    const todolists = dbs.map((dbName: string) => ({
      id: dbName.replace('db_', ''),
      title: dbName,
    }))
    res.json(todolists) // Senden Sie die Liste der Todo-Listen als Array von Objekten zurück
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(4001, () => console.log('Server is running on port 4001'))
