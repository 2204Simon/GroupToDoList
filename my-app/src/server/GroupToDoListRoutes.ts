import express from 'express'
import { couch } from './server.ts' // Importieren Sie die CouchDB-Instanz aus Ihrer Hauptserverdatei
import { v4 as uuidv4 } from 'uuid'
import { validate as isUuid } from 'uuid'
import { getUserIdFromToken } from './jwtMiddleware.ts'
import {
  findUserByEmail,
  findUserByToken,
  publicDocumentsCouchDB,
} from './couchUtilities.ts'

export const GroupToDoListRoutes = express.Router()
// Endpunkt zum Erstellen einer neuen Todo-Liste

GroupToDoListRoutes.post('/todolists', async (req, res) => {
  try {
    const { title } = req.body
    const { database, token } = req.cookies

    const user = await findUserByToken(req.cookies.token)
    const userDatabaseId = user.databaseId
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    // const id = uuidv4() // Generieren Sie eine eindeutige ID
    const groupListId = `gtd_${uuidv4()}`
    if (user.databaseId !== database) {
      //updateCookie
      res.cookie('database', userDatabaseId, {
        httpOnly: false,
        sameSite: 'none',
        secure: true,
      })
    }

    if (database) {
      const dbName = `${groupListId}`
      await couch.createDatabase(dbName)
      const member = [{ email: user.email, role: 'admin' }]
      await couch.insert(dbName, {
        member,
        type: 'roles',
      })
      await publicDocumentsCouchDB(dbName)
      await couch.insert(userDatabaseId, {
        _id: groupListId,
        title,
        dbName,
      })
      res.json({ message: 'Todo-Liste erfolgreich erstellt', groupListId }) // Senden Sie die ID zurück
      return
    }
    res.status(404).json({ error: 'Database not found' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
GroupToDoListRoutes.get('/todolists', async (req, res) => {
  try {
    const user = await findUserByToken(req.cookies.token)
    console.log('User:', user) // Protokollierung hinzufügen
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    const { database } = req.cookies // Extrahieren Sie die Datenbank-ID aus den Cookies
    console.log('Database ID:', database) // Protokollierung hinzufügen
    const dbs = await couch.listDatabases()
    if (!dbs.includes(database)) {
      res.status(404).json({ error: 'Database not found' })
      return
    }
    const mangoQuery = { selector: { _id: { $gt: null } } }
    const { data: docs } = await couch.mango(database, mangoQuery)
    const todoLists = docs.docs.map((doc: { _id: any; title: any }) => ({
      id: doc._id,
      title: doc.title,
    }))
    res.json(todoLists)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

GroupToDoListRoutes.post('/inviteTodoLists', async (req, res) => {
  try {
    const { email, groupListId, role } = req.body
    console.log(email, groupListId)
    const user = await findUserByEmail(email)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    const updateGroupList = await couch.find(user.databaseId, groupListId)
    const updateUserGrupsList = await couch.find(user.databaseId, 'userGroups')
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

GroupToDoListRoutes.put('/inviteTodoLists', async (req, res) => {
  try {
    const { email, groupListId, title } = req.body
    console.log(email, groupListId)
    const { data, header, status } = await findUserByEmail(email)
    if (status === 404) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    const groupList = await couch.find(data.databaseId, groupListId)
    const singlemember = { email: data.email, role: 'member' }
    groupList.data.member.push(singlemember)

    // Save the updated group list back to the database
    await couch.update(data.databaseId, groupListId, groupList)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

GroupToDoListRoutes.put('/todolists/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title } = req.body
    const dbName = `${id}`

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
