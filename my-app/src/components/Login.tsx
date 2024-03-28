import { useState } from 'react'
import {
  LoginButton,
  LoginCard,
  LoginContainer,
  LoginInput,
} from './Login.style'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:4001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()

      if (data.message === 'Login successful') {
        console.log('Login successful')
        navigate('/home')
        // Handle successful login here
      } else {
        console.log('Login failed')
        // Handle failed login here
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    
    <LoginContainer>
      <LoginCard>
        <h2>Login</h2>
        <LoginInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <LoginInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginButton onClick={handleLogin}>Login</LoginButton>
      </LoginCard>
    </LoginContainer>
  )
}

export default Login
