import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import About from './pages/About'
import Profiles from './pages/Profiles'
import './App.css'

function App() {
  return (
    <BrowserRouter>
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
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profiles" element={<Profiles />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
