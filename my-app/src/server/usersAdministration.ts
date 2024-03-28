import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { couch } from './server.ts'
import { generateAccessToken } from './jwtMiddleware.ts'

const dbName = 'users' // Change this to your user database name
export const UserAdministrationRouter = express.Router()

// Handle POST request on /users route
UserAdministrationRouter.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body
    console.log(req.body)
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid password' })
    }
    const hashedPassword = await bcrypt.hash(password, 10) // Hash the password
    const user = await couch.insert(dbName, {
      username,
      email,
      password: hashedPassword, // Store the hashed password
      userId: uuidv4(),
    })
    console.log(user.data)
    const token = generateAccessToken(user.data.id) // Generate a new token for the user
    console.log(token, 'token2')

    res.cookie('token2', token, { httpOnly: false }) // Store the token in a cookie
    res.status(201).json(user.data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

UserAdministrationRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    console.log(req.body)

    const users = await couch.mango(dbName, {
      selector: {
        email: email,
      },
    })

    if (users.data.docs.length === 0) {
      return res.status(400).json({ error: 'User not found' })
    }

    const user = users.data.docs[0]

    const match = await bcrypt.compare(password, user.password)

    if (match) {
      const token = generateAccessToken(user.userId) // Generate a new token for the user
      res.cookie('token', token) // Store the token in a cookie
      res.json({ message: 'Login successful' })
    } else {
      res.status(400).json({ error: 'Invalid password' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
