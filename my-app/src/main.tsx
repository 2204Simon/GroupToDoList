import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'
import Sidebar from './components/Sidebar.tsx'
import styled from 'styled-components'
import SingleToDoList from './components/SingleToDoList.tsx'
import {useCookies} from 'react-cookie'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from './AuthContext';
import './App.css'

const Layout = styled.div`
  display: flex;
`

function CheckToken() {
  const navigate = useNavigate()
  const [cookies] = useCookies(['token'])

  useEffect(() => {
    if (!cookies.token) {
      navigate('/register')
    }
  }, [cookies, navigate])

  return null
}

function Main() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <React.StrictMode>
      <Router>
        <CheckToken />
        <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
        <Layout>
          <Sidebar />
          
          <Routes>
            <Route path="/home" element={<App />} />
            <Route path="/todoList/:id" element={<SingleToDoList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Fügen Sie hier weitere Routen hinzu */}
          </Routes>
          <ToastContainer />
        </Layout>
        </AuthContext.Provider>
      </Router>
    </React.StrictMode>
  )
}


ReactDOM.createRoot(document.getElementById('root')!).render(<Main />)
