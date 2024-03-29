import { useState, useContext } from 'react'
import {
  LoginButton,
  LoginCard,
  LoginContainer,
  LoginInput,
} from './Login.style'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../AuthContext'
import styled from 'styled-components'
import { Link } from 'react-router-dom';

const BlurBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  z-index: 1;
`;
function Login() {
  const { isLoggedIn, setLoggedIn } = useContext(AuthContext);
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
        toast.error('Login fehlgeschlagen')
        throw new Error('Login failed')
      }

      const data = await response.json()

      if (data.message === 'Login successful') {
        setLoggedIn(true);
        toast.success('Login erfolgreich')
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
    <>
    <BlurBackground />
    
    <LoginContainer style={{ zIndex: 2 }}>
      <LoginCard>
        <h2>Login</h2>
        <LoginInput
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <LoginInput
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginButton onClick={handleLogin}>Login</LoginButton>
        Passwort vergessen? <Link to="/register"><strong>Hier</strong> </Link>zur Neuregistrierung
        


      </LoginCard>
    </LoginContainer>
    </>
  )
}

export default Login

