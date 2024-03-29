import express from 'express';
import { couch } from './server'; // Importieren Sie die CouchDB-Instanz aus Ihrer Hauptserverdatei
import { v4 as uuidv4 } from 'uuid';
import { validate as isUuid } from 'uuid';
import { getUserIdFromToken } from './jwtMiddleware.ts';

export const TodoRoutes = express.Router();
const dbName = 'db';

// Beispiel-Endpunkt zum Abrufen aller To-Dos
TodoRoutes.get('/todos', async (req, res) => {
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
  TodoRoutes.post('/todos', async (req, res) => {
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
  
  TodoRoutes.delete('/todos/:id', async (req, res) => {
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
  
  TodoRoutes.put('/todos/:id', async (req, res) => {
    try {
      const id = req.params.id
      const { title, description, completed } = req.body
      const todo = await couch.get(dbName, id)
      if (todo.data._id) {
        const updatedTodo = await couch.update(dbName, {
          _id: todo.data._id,
          _rev: todo.data._rev,
          title,
          description,
          completed,
        })
        res.json(updatedTodo.data)
      } else {
        res.status(404).json({ error: 'To-Do not found' })
      }
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })
  //Todo als Erledigt markieren
  TodoRoutes.put('/todos/:id', async (req, res) => {
    try {
      const id = req.params.id
      const { completed } = req.body
      const todo = await couch.get(dbName, id)
      if (todo.data._id) {
        const updatedTodo = await couch.update(dbName, {
          _id: todo.data._id,
          _rev: todo.data._rev,
          completed,
        })
        res.json(updatedTodo.data)
      } else {
        res.status(404).json({ error: 'To-Do not found' })
      }
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })