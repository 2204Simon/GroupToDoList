export function checkAndCreateDatabases(couch: any, dbNames: string[]) {
  couch.listDatabases().then((dbs: string[]) => {
    dbNames.forEach((dbName) => {
      if (dbs && dbs.includes(dbName)) {
        console.log(`Datenbank ${dbName} existiert bereits`)
      } else {
        couch.createDatabase(dbName).then(
          () => {
            console.log(`Datenbank ${dbName} erfolgreich erstellt`)
          },
          (err: Error) => {
            console.error(err)
          },
        )
      }
    })
  })
}

export async function publicDocumentsCouchDB(dbName: string) {
  await fetch(`http://localhost:5984/${dbName}/_security`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}`,
        ).toString('base64'),
    },
    body: JSON.stringify({
      admins: {
        names: [],
        roles: [],
      },
      members: {
        names: [],
        roles: ['_admin'],
      },
    }),
  })
}
