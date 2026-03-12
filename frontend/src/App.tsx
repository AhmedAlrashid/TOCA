import React from 'react'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  return (
    <div style={{ 
      display: 'flex',
      height: '100vh',
      backgroundColor: 'white',
      margin: 0,
      padding: 0,
      position: 'relative',
      left: 0,
      top: 0
    }}>
      <Sidebar currentPath={window.location.pathname} />
    </div>
  )
}

export default App
