import express from 'express';
import { couch } from './server.ts' // Importieren Sie die CouchDB-Instanz aus Ihrer Hauptserverdatei
import { v4 as uuidv4 } from 'uuid';
import { validate as isUuid } from 'uuid';
import { getUserIdFromToken } from './jwtMiddleware.ts';

export const GroupToDoListRoutes= express.Router();
const dbNameUsers = 'users'
// Endpunkt zum Erstellen einer neuen Todo-Liste

GroupToDoListRoutes.post('/todolists', async (req, res) => {
  try {
    console.log(req.cookies)
    const testToken = 'testtoken'
    const { title } = req.body
    const { token } = req.cookies
    const id = uuidv4() // Generieren Sie eine eindeutige ID
    const dbName = `${id}`

    const dbs = await couch.listDatabases()
    if (!dbs.includes(testToken)) {
      await couch.createDatabase(testToken) // Erstellen Sie die Datenbank, wenn sie nicht existiert
    }
    await couch.insert(testToken, { _id: uuidv4(), title, dbName })

    if (dbs.includes(dbName)) {
      res.status(400).json({ error: 'Todo-Liste existiert bereits' })
    } else {
      await couch.createDatabase(dbName)
      await couch.insert(dbName, { id, title })
      res.json({ message: 'Todo-Liste erfolgreich erstellt', id }) // Senden Sie die ID zurück
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

GroupToDoListRoutes.get('/todolists', async (req, res) => {
  try {
    if (!req.cookies.token) {
      res.status(401).json({ error: 'No token provided' })
      return
    }
    const userId = getUserIdFromToken(req.cookies.token)
     
    


    if (!userId) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    const dbs = await couch.listDatabases()
    const user = await couch.get(dbNameUsers, userId)

    const todolists = await Promise.all(
      user.data.groupTodoLists
        .filter((todoList: { _id: any; role: any }) => isUuid(todoList._id))
        .map(async (todoList: { _id: any; role: any }) => {
          const dbName = `${todoList._id}`
          if (!dbs.includes(dbName)) {
            return null // Wenn die Datenbank nicht existiert, überspringen Sie sie
          }
          const db = couch.use(dbName)
          const title = await db.get('title')
          return { id: todoList._id, title: title.data }
        }),
    )
    res.json(todolists.filter((todoList: any) => todoList !== null))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

GroupToDoListRoutes.put('/todolists/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title } = req.body
    const dbName =  `${id}`

    const dbs = await couch.listDatabases()
    if (!dbs.includes(dbName)) {
      res.status(404).json({ error: 'Datenbank nicht gefunden' })
      return
    }

    // Finden Sie das Dokument mit der angegebenen id
    const mangoQuery = { selector: { id: id } }
    const { data: docs } = await couch.mango(dbName, mangoQuery)
    if (docs.docs.length === 0) {
      res.status(404).json({ error: 'Dokument nicht gefunden' })
      return
    }

    const doc = docs.docs[0]
    const updatedDoc = { ...doc, title } // Aktualisieren Sie den Titel
    await couch.insert(dbName, updatedDoc) // Aktualisieren Sie das Dokument
    res.json({ message: 'Todo-Liste erfolgreich aktualisiert' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

