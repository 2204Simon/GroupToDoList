import PouchDB from 'pouchdb-browser'
import { Todo, TodoDocument } from '../types/types'

export function createTodo(
  todoDatenbankName: string,
  title: string,
  description: string,
  assignedTo: string,
  completed: boolean,
  label: string,
  dueDate: Date,
): Promise<Todo> {
  const remoteDB = new PouchDB(`http://localhost:5984/${todoDatenbankName}`)
  const localDB = new PouchDB(todoDatenbankName)
  const todo = localDB.post({
    title: title,
    description: description,
    assignedTo: assignedTo,
    completed: completed,
    label: label,
    dueDate: dueDate,
  })
  syncDatabases(localDB, remoteDB)
  return todo.then(response => ({
    _id: response.id,
    title: title,
    description: description,
    assignedTo: assignedTo,
    completed: completed,
    label: label,
    dueDate: dueDate,
  }))
}

export const loadTodos = async (
  todoDatenbankName: string,
): Promise<Array<Todo>> => {
  const localDB = new PouchDB(todoDatenbankName)
  const allDocs = await localDB.allDocs({ include_docs: true })
  return allDocs.rows.reduce((todos, row) => {
    const doc = row.doc as TodoDocument
    if (doc) {
      todos.push({
        _id: doc._id,
        title: doc.title,
        description: doc.description,
        assignedTo: doc.assignedTo,
        completed: doc.completed,
        label: doc.label,
        dueDate: doc.dueDate,
      } as Todo)
    }
    return todos
  }, [] as Todo[])
}

export const deleteTodo = async (todoDatenbankName: string, id: string) => {
  const localDB = new PouchDB(todoDatenbankName)
  const doc = await localDB.get(id)
  await localDB.remove(doc)
  syncDatabases(
    localDB,
    new PouchDB(`http://localhost:5984/${todoDatenbankName}`),
  )
}

export const updateTodo = async (
  todoDatenbankName: string,
  id: string,
  updatedTodo: any,
) => {
  const localDB = new PouchDB(todoDatenbankName)
  const doc = await localDB.get(id)
  await localDB.put({ ...doc, ...updatedTodo })
  syncDatabases(
    localDB,
    new PouchDB(`http://localhost:5984/${todoDatenbankName}`),
  )
}

export const completeTodo = async (
  todoDatenbankName: string,
  id: string,
  isCompleted: boolean,
) => {
  const localDB = new PouchDB(todoDatenbankName)
  console.log('completeTodo', id, isCompleted)

  const doc = await localDB.get(id)
  await localDB.put({ ...doc, completed: isCompleted })
  syncDatabases(
    localDB,
    new PouchDB(`http://localhost:5984/${todoDatenbankName}`),
  )
}

const syncDatabases = (
  localDB: PouchDB.Database,
  remoteDB: PouchDB.Database,
) => {
  localDB
    .sync(remoteDB, {
      live: true,
      retry: true,
    })
    .on('error', console.log)
}
