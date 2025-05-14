// Authentication service for backend API

// API base URL - Using Vite env variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://ec2-3-14-28-95.us-east-2.compute.amazonaws.com:5000";
const API_URL = `${API_BASE_URL}/api/auth`;

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// Register a new user
export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include',
    });

    const data: AuthResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store auth token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data: AuthResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    // Store auth token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Even if the API call fails, remove the local storage items
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Check if user is authenticated
export const checkAuthStatus = async (): Promise<User | null> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Auth check error:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};
