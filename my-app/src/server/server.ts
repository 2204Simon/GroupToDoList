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
app.use('/api/', UserAdministrationRouter, TodoAdministration)
app.use(express.json())
checkAndCreateDatabases(couch, [dbName, dbNameUsers, todoDbName])

app.listen(4001, () => console.log('Server is running on port 4001'))
