import express from "express";
import NodeCouchDb from "node-couchdb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const couch = new NodeCouchDb({
  auth: {
    user: process.env.COUCHDB_USER,
    pass: process.env.COUCHDB_PASSWORD,
  },
  host: "localhost",
  protocol: "http",
  port: 5984,
});

const dbName = "db";

const app = express();
// CORS für alle Routen und Origin akzeptieren
app.use(cors());
app.use(express.json());

// Überprüfen, ob die Datenbank existiert, bevor Sie sie erstellen
couch.listDatabases().then((dbs: string[]) => {
  if (dbs.includes(dbName)) {
    console.log("Datenbank existiert bereits");
  } else {
    // Datenbank erstellen
    couch.createDatabase(dbName).then(
      () => {
        console.log("Datenbank erfolgreich erstellt");
      },
      (err: Error) => {
        console.error(err);
      }
    );
  }
});

app.listen(4001, () => console.log("Server is running on port 4001"));

app.post("/api/addToDo", async (req, res) => {
  const newTodo = req.body;
  const todo = await couch.insert(dbName, newTodo);

  res.status(201).json(newTodo);
});
