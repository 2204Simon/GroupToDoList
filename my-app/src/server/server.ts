import express from "express";
import NodeCouchDb from "node-couchdb";
import dotenv from "dotenv";

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

const dbName = "my_database";

const app = express();

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
