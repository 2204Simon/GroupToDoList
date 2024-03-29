import { remoteDB } from './../db'
import PouchDB from 'pouchdb-browser'

    export function createTodo(todoDatenbankName: string, title: string, description: string, completed: boolean) {
      const remoteDB = new PouchDB(`http://localhost:5984/${todoDatenbankName}`);
      const localDB = new PouchDB(todoDatenbankName);
      const todo = localDB.post({
        title: title,
        description: description,
        completed: completed,
      });
      syncDatabases(localDB, remoteDB);
      return todo;
    }

    export const loadTodos = async (todoDatenbankName: string) => {
      const localDB = new PouchDB(todoDatenbankName);
      const allDocs = await localDB.allDocs({ include_docs: true });
      return allDocs.rows.map(row => row.doc);
    }
    
    export const deleteTodo = async (todoDatenbankName: string, id: string) => {
      const localDB = new PouchDB(todoDatenbankName);
      const doc = await localDB.get(id);
      await localDB.remove(doc);
      syncDatabases(localDB, new PouchDB(`http://localhost:5984/${todoDatenbankName}`));
    }
    
    export const updateTodo = async (todoDatenbankName: string, id: string, updatedTodo: any) => {
      const localDB = new PouchDB(todoDatenbankName);
      const doc = await localDB.get(id);
      await localDB.put({ ...doc, ...updatedTodo });
      syncDatabases(localDB, new PouchDB(`http://localhost:5984/${todoDatenbankName}`));
    }
    
    export const completeTodo = async (todoDatenbankName: string, id: string, isCompleted: boolean) => {
      const localDB = new PouchDB(todoDatenbankName);
      const doc = await localDB.get(id);
      await localDB.put({ ...doc, completed: isCompleted });
      syncDatabases(localDB, new PouchDB(`http://localhost:5984/${todoDatenbankName}`));
    }
    
    const syncDatabases = (localDB: PouchDB.Database, remoteDB: PouchDB.Database) => {
      localDB.sync(remoteDB, {
        live: true,
        retry: true
      }).on('error', console.log);
    }





