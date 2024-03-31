import PouchDB from 'pouchdb-browser'
import { useCookies } from 'react-cookie'

export const loadTodoListNames = async (): Promise<Array<string>> => {
  const [cookies, setCookie] = useCookies(['database'])
  const remoteDB = new PouchDB(
    `http://${encodeURIComponent('admin')}:${encodeURIComponent('12345')}@localhost:5984/${cookies.database}`,
  )
  const localDB = new PouchDB(cookies.database)
  const sync = localDB.sync(remoteDB, {
    live: true,
    retry: true,
  })
  const response = await localDB.allDocs({
    include_docs: true,
    startkey: 'todo',
    endkey: 'todo\uffff',
  })
  const todoListNames = response.rows.map((row: any) => row.doc.name)
  return todoListNames
}
