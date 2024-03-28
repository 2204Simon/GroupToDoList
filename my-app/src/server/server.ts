import express from 'express'
import NodeCouchDb from 'node-couchdb'
import dotenv from 'dotenv'
import cors from 'cors'
import { UserAdministrationRouter } from './usersAdministration.ts'
import bodyParser from 'body-parser'
import { checkAndCreateDatabases } from './couchUtilities.ts'
import { TodoAdministration } from './todoAdministration.ts'
import { authenticateJWT, getUserIdFromToken } from './jwtMiddleware.ts'
import cookieParser from 'cookie-parser'
import { TodoDatabaseCreation } from './groupTodoLists.tsx'
import { v4 as uuidv4 } from 'uuid'
import { validate as isUuid } from 'uuid';


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
//app.use(authenticateJWT)
// app.use(authenticateJWT)
app.use(express.json())
app.use(
  '/api/',
  UserAdministrationRouter,
  TodoAdministration,
  TodoDatabaseCreation,
)
checkAndCreateDatabases(couch, [dbName, dbNameUsers, todoDbName])


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


app.get('/todolists', async (req, res) => {
  try {
    if (!req.cookies.token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    const userId = getUserIdFromToken(req.cookies.token);
    
    ;
    if (!userId) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const dbs = await couch.listDatabases();
    const user = await couch.get(dbNameUsers, userId);
    
    const todolists = await Promise.all(
      user.data.groupTodoLists
        .filter((todoList: { _id: any; role: any }) => isUuid(todoList._id))
        .map(async (todoList: { _id: any; role: any }) => {
          const dbName = `db_${todoList._id}`;
          if (!dbs.includes(dbName)) {
            return null; // Wenn die Datenbank nicht existiert, überspringen Sie sie
          }
          const db = couch.use(dbName);
          const title = await db.get('title');
          return { id: todoList._id, title: title.data };
        }
      )
    );
    res.json(todolists.filter((todoList: any) => todoList !== null));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
);

app.listen(4001, () => console.log('Server is running on port 4001'))
