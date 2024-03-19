import { useEffect, useState } from 'react'
import {
  LoginButton,
  LoginCard,
  LoginContainer,
  LoginInput,
} from './Login.style'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const navigate = useNavigate()

  const handleRegister = async () => {
    const response = await fetch('http://localhost:4001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      navigate('/login')
      console.log('Registration successful', data)
    } else {
      console.error('Registration failed')
    }
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
