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
import { TodoRoutes } from './TodoRoutes.ts'
import { GroupToDoListRoutes } from './GroupToDoListRoutes.ts'

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

async function checkCouchDB() {
  // wenn docker container nicht läuft fehler an user zurückgeben
  try {
    await couch.listDatabases()
  } catch (error) {
    console.error('Docker Container mit CouchDB läuft nicht!')
    process.exit(1)
  }
}

checkCouchDB()

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
  TodoRoutes,
  GroupToDoListRoutes,
)
checkAndCreateDatabases(couch, [dbName, dbNameUsers, todoDbName])
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



app.listen(4001, () => console.log('Server is running on port 4001'))
