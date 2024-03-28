import PouchDB from 'pouchdb'

export async function loadTodoLists() {
  let dbNames = []

  try {
    // Versuchen Sie, die Datenbanknamen vom Server zu holen
    const response = await fetch('http://your-couchdb-server/_all_dbs')
    dbNames = await response.json()
  } catch (error) {
    console.error(
      'Could not fetch DB names from server, using local storage',
      error,
    )
    // Wenn der Server nicht erreichbar ist, holen Sie die Namen aus dem localStorage
    const localDbNames = localStorage.getItem('dbNames')
    console.log('localDbNames', localDbNames)
    dbNames = localDbNames ? JSON.parse(localDbNames) : []
  }

  // Laden Sie die Todo-Listen aus den Datenbanken
  const todoLists = await Promise.all(
    dbNames.map(async (dbName: string) => {
      const db = new PouchDB(dbName)
      const allDocs = await db.allDocs({ include_docs: true })
      return allDocs.rows.map((row) => row.doc)
    }),
  )

  return todoLists
}
