import PouchDB from 'pouchdb-browser'
import { useCookies } from 'react-cookie'
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
  const remoteDB = new PouchDB(
    `http://${encodeURIComponent('admin')}:${encodeURIComponent('12345')}@localhost:5984/${todoDatenbankName}`,
  )
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
  return todo.then((response) => ({
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
    if (doc && doc.type !== 'roles') {
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
    new PouchDB(
      `http://${encodeURIComponent('admin')}:${encodeURIComponent('12345')}@localhost:5984/${todoDatenbankName}`,
    ),
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
    new PouchDB(
      `http://${encodeURIComponent('admin')}:${encodeURIComponent('12345')}@localhost:5984/${todoDatenbankName}`,
    ),
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
    new PouchDB(
      `http://${encodeURIComponent('admin')}:${encodeURIComponent('12345')}@localhost:5984/${todoDatenbankName}`,
    ),
  )
}

export const getGroupListName = async (groupListId: string, cookie: any) => {
  const localDB = new PouchDB(cookie.database)
  try {
    const doc: any = await localDB.get(groupListId)
    console.log(doc)
    const title = doc.title

    return title
  } catch (error) {
    console.error(`Error getting document: ${error}`)
    return null
  }
}
export const findRoleForTodoList = async (groupListId: string, cookie: any) => {
  try {
    const localDB = new PouchDB(cookie.database)

    const localGroupListDb = new PouchDB(groupListId)

    // Get the document from the localDB
    const docFromLocalDB: any = await localDB.get(groupListId)

    const email = docFromLocalDB.email

    // Get the document from the localGroupListDb
    const allDocs: any = await localGroupListDb.allDocs({ include_docs: true })

    // Find the document with type 'roles'
    const rolesDoc = allDocs.rows.find((row: any) => row.doc.type === 'roles')

    const member = rolesDoc.doc.member.find(
      (m: { email: string; role: string }) => m.email === email,
    )
    const role = member ? member.role : null

    return role
  } catch (error) {
    console.error(`Error getting document: ${error}`)
    return null
  }
}

export const syncDatabases = (
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
