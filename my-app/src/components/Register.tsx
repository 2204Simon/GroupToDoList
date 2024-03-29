import { useEffect, useState } from 'react'
import {
  LoginButton,
  LoginCard,
  LoginContainer,
  LoginInput,
} from './Login.style'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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
      //toastify success
      toast.success("Registrierung erfolgreich")
      console.log('Registration successful', data)
    } else {
      toast.error("Registrierung fehlgeschlagen")
      console.error('Registration failed')
    }
  }

  return (
    <LoginContainer>
      <LoginCard>
        <h2>Registrieren</h2>
        <LoginInput
          type="text"
          placeholder="Benutzername"
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
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginButton onClick={handleRegister}>Registrieren</LoginButton>
      </LoginCard>
    </LoginContainer>
  )
}

export default Register
