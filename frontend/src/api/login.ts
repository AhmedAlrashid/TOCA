interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    username: string;
    userType: string;
  };
}

interface ApiError {
  success: false;
  message: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data: LoginResponse | ApiError = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data as LoginResponse;
  } catch (error) {
    console.error('Login error:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred during login');
  }
};

export const validateLoginFields = (username: string, password: string): string | null => {
  if (!username.trim()) {
    return 'Username is required';
  }
  
  if (!password.trim()) {
    return 'Password is required';
  }
  
  return null;
};

// Export types for use in components
export type { LoginRequest, LoginResponse, ApiError };
