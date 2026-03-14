import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import About from './pages/About'
import Profiles from './pages/Profiles'
import Login from './pages/login'
import { PopoverManager } from './components/core/Popover'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
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
        {!isLoginPage && <Sidebar />}
        <div style={{ 
          flex: 1,
          width: isLoginPage ? '100%' : 'auto'
        }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } />
            <Route path="/profiles" element={
              <ProtectedRoute>
                <Profiles />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </PopoverManager>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
