import { getUserIdFromToken } from './jwtMiddleware.ts'
import { couch } from './server.ts'

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

export async function findUserByToken(token: string) {
  const userId: any = getUserIdFromToken(token)
  console.log(userId, 'userId')
  console.log('Tokentoken', userId.userId)
  const { data, headers, status } = await couch.get('users', userId.userId)
  console.log(data, headers, status)
  return data
}

export async function findUserByEmail(email: string) {
  const selector = {
    email: { $eq: email },
  }
  const user = await couch.find('users', selector)
  return user // gibt den ersten gefundenen Benutzer zurück
}
