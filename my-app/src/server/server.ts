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

app.use(cors());
app.use(express.json());

couch.listDatabases().then((dbs: string[]) => {
  if (dbs.includes(dbName)) {
    console.log("Datenbank existiert bereits");
  } else {
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

// Beispiel-Endpunkt zum Abrufen aller To-Dos
app.get("/todos", async (req, res) => {
  try {
    const todos = await couch.mango(dbName, {
      selector: {},
    });
    res.json(todos.data.docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Beispiel-Endpunkt zum Erstellen eines neuen To-Dos
app.post("/todos", async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = await couch.insert(dbName, {
      title,
      description,
      completed: false,
    });
    res.json(todo.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.delete("/todos/:id", async (req, res) => {
//   const todoId = req.params.id;

//   try {
//     const result = await couch.del(dbName, todoId, {});
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.listen(4001, () => console.log("Server is running on port 4001"));
