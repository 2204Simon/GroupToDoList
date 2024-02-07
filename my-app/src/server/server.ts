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

// Erstellen Sie die Datenbank beim Starten des Servers
couch.createDatabase(dbName).then(
  () => {
    console.log("Database created");
  },
  (err: any) => {
    console.log("Error creating database", err);
  }
);

app.listen(3001, () => console.log("Server is running on port 3001"));

app.post("/api/addToDo", async (req, res) => {
  const newTodo = req.body;
  const todo = await couch.insert(dbName, newTodo);

  res.status(201).json(newTodo);
});
