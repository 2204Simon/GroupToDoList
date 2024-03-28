import express from 'express'
import NodeCouchDb from 'node-couchdb'
import dotenv from 'dotenv'
import cors from 'cors'
import { UserAdministrationRouter } from './usersAdministration.ts'
import bodyParser from 'body-parser'
import { checkAndCreateDatabases } from './couchUtilities.ts'
import { TodoAdministration } from './todoAdministration.ts'
import { authenticateJWT } from './jwtMiddleware.ts'
import cookieParser from 'cookie-parser'
import { TodoDatabaseCreation } from './groupTodoLists.tsx'

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
const todoDbName = 'todo'
const dbNameUsers = 'users'
const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(authenticateJWT)
app.use(express.json())
app.use(
  '/api/',
  UserAdministrationRouter,
  TodoAdministration,
  TodoDatabaseCreation,
)
checkAndCreateDatabases(couch, [dbName, dbNameUsers, todoDbName])

app.listen(4001, () => console.log('Server is running on port 4001'))
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
    const { title } = req.body
    const id = uuidv4() // Generieren Sie eine eindeutige ID
    const dbName = `db_${id}`

    const dbs = await couch.listDatabases()
    if (dbs.includes(dbName)) {
      res.status(400).json({ error: 'Todo-Liste existiert bereits' })
    } else {
      await couch.createDatabase(dbName)
      await couch.insert(dbName, { title }) // Fügen Sie den Titel der Todo-Liste in die Datenbank ein
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
    const todolists = await Promise.all(
      dbs.map(async (dbName: string) => {
        const id = dbName.replace('db_', '')
        const response = await couch.mango(dbName, { selector: {} }) // Abrufen der Daten aus der Datenbank
        console.log(response) // Drucken Sie die Antwort
        const {
          data: { docs },
        } = response
        const title = docs[0]?.title || dbName // Verwenden Sie den Titel aus der Datenbank, falls vorhanden
        return { id, title }
      }),
    )
    res.json(todolists) // Senden Sie die Liste der Todo-Listen als Array von Objekten zurück
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(4001, () => console.log('Server is running on port 4001'))
