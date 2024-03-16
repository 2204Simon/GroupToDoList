import express from 'express';
import NodeCouchDb from 'node-couchdb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const couch = new NodeCouchDb({
  auth: {
    user: process.env.COUCHDB_USER,
    pass: process.env.COUCHDB_PASSWORD,
  },
  host: 'localhost',
  protocol: 'http',
  port: 5984,
});

const dbName = 'users'; // Change this to your user database name
export const UserAdministrationRouter = express.Router();

// Handle POST request on /users route
UserAdministrationRouter.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = await couch.insert(dbName, {
      username,
      email,
      password: hashedPassword, // Store the hashed password
      userId: uuidv4(),
    });
    res.json(user.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


UserAdministrationRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await couch.mango(dbName, {
      selector: {
        email: email,
      },
    });

    if (users.data.docs.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = users.data.docs[0];

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(400).json({ error: 'Invalid password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});