import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'
import Sidebar from './components/Sidebar.tsx'
import styled from 'styled-components'

const Layout = styled.div`
  display: flex;
`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Layout>
        <Sidebar />
        <Routes>
          <Route path="/home" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Fügen Sie hier weitere Routen hinzu */}
        </Routes>
      </Layout>
    </Router>
  </React.StrictMode>,
)
