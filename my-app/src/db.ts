import PouchDB from 'pouchdb-browser';
import { User } from './types/types'
import { v4 as uuidv4 } from 'uuid';
import { DokumentTypes } from './types/enums'


export const remoteDB = new PouchDB('http://localhost:5984/globaldatabase')
const localDB = new PouchDB('groupTodoListDB')
localDB.sync(remoteDB).then(() => {
  console.log('Database synced successfully')
}).catch((error) => {
  console.error('Error syncing database', error)
});
export const createUser = async (user: User) => {
  try {
    user.userId = uuidv4()
    const response = await localDB.put({
      _id: user.userId, // Verwenden Sie den Benutzernamen als ID
      type: DokumentTypes.USER,
      name: user.username,
      email: user.email,
      password: user.password,
      
      // Fügen Sie hier weitere Benutzerinformationen hinzu
    })
    console.log('User created successfully', response)
  } catch (error) {
    console.error('Error creating user', error)
  }
}

export default localDB
