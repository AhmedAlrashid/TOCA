import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/login';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{username?: string; password?: string; general?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const result = await loginUser({ username, password });
      
      if (result.success) {
        // Login successful - store user in context and redirect
        setCurrentUser(result.data?.username || username);
        console.log('Login successful:', result.data);
        navigate('/home');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      // Determine which field(s) are incorrect based on error message
      if (errorMessage.includes('username') || errorMessage.includes('Invalid username')) {
        setErrors({ username: 'Invalid username' });
      } else if (errorMessage.includes('password') || errorMessage.includes('Invalid password')) {
        setErrors({ password: 'Invalid password' });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: '#333'
        }}>
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#555'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.username ? '2px solid red' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none'
              }}
              placeholder="Enter your username"
            />
            {errors.username && (
              <div style={{ 
                color: 'red', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem' 
              }}>
                {errors.username}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#555'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.password ? '2px solid red' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none'
              }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div style={{ 
                color: 'red', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem' 
              }}>
                {errors.password}
              </div>
            )}
          </div>

          {errors.general && (
            <div style={{ 
              color: 'red', 
              fontSize: '0.875rem', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#ccc' : 'black',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
