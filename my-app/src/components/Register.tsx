import { useEffect, useState } from 'react'
import {
  LoginButton,
  LoginCard,
  LoginContainer,
  LoginInput,
} from './Login.style'
import localDB, { createUser, remoteDB } from '../db'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')


  const handleRegister = async () => {
    // Implement your registration logic here
    await createUser({ userId: '1', username, password, email })
    console.log(
      `Registered with username: ${username}, email: ${email}, password: ${password}`,
    )
  }

  return (
    <LoginContainer>
      <LoginCard>
        <h2>Register</h2>
        <LoginInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <LoginInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <LoginInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginButton onClick={handleRegister}>Register</LoginButton>
      </LoginCard>
    </LoginContainer>
  )
}

export default Register
