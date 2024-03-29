import React from 'react'
import AllGroupToDoLists from './components/AllGroupToDoLists'
import './App.css'

const App: React.FC = () => {
  return (
    <div>
      <h1>Gruppen To-Do-Verwaltung</h1>
      <AllGroupToDoLists />
    </div>
  )
}

export default App