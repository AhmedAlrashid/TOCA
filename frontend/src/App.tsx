import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import About from './pages/About'
import Profiles from './pages/Profiles'
import { PopoverManager } from './components/core/Popover'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <PopoverManager>
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
      </PopoverManager>
    </BrowserRouter>
  )
}

export default App
