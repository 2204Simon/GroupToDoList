import { useEffect, useState } from 'react'
import {
  LoginButton,
  LoginCard,
  LoginContainer,
  LoginInput,
} from './Login.style'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useCookies } from 'react-cookie'

const BlurBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  z-index: 1;
`;
function Register() {
  const [isRegistering, setIsRegistering] = useState(false);
  useEffect(() => {
    setIsRegistering(true);
  }, []);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [cookies] = useCookies(['token']);

  const navigate = useNavigate()

  const handleRegister = async () => {
    setIsRegistering(true);
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
    <>
    {isRegistering && <BlurBackground />}
    <LoginContainer style={{ zIndex: isRegistering ? 2 : 1 }}>
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
        <p>
          Bereits registriert?{' '}
          <span
            style={{  cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            <strong>Hier</strong> einloggen
          </span>
          <br />
          
          {cookies.token && (
  <span
    style={{ cursor: 'pointer' }}
    onClick={() => navigate(-1)}
  >
    Hier gehts <strong>Zurück</strong> 
  </span>
)}
          
          
        </p>
      </LoginCard>
    </LoginContainer>
    </>
  )
}

export default Register
