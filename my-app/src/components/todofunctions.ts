import { remoteDB } from './../db'
import PouchDB from 'pouchdb-browser'

export function createTodo(todoDatenbankName: string, caption: string) {
  const remoteDB = new PouchDB(`http://localhost:5984/${todoDatenbankName}`)
  const localDB = new PouchDB(todoDatenbankName)
  const todo = remoteDB.post({
    _id: caption,
    type: 'todo',
    caption: caption,
    completed: false,
  })
}
