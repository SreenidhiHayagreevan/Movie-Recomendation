// Simulating authentication service that would interact with Django backend

interface LoginResponse {
  id: number;
  username: string;
  isAdmin: boolean;
  token: string;
}

// This would be replaced with actual API calls to Django
export const loginUser = async (username: string, password: string) => {
  // In a real app, this would be an API call to Django's auth system
  if (username === 'admin' && password === 'admin') {
    const userData = {
      id: 1,
      username: 'admin',
      isAdmin: true,
    };
    
    // Store auth token in localStorage (in a real app, this would come from the server)
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  }
  
  throw new Error('Invalid credentials');
};

export const logoutUser = async () => {
  // In a real app, this would be an API call to Django's auth system
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  return true;
};

export const checkAuthStatus = async () => {
  // In a real app, this would validate the token with the server
  const token = localStorage.getItem('authToken');
  const userJson = localStorage.getItem('user');
  
  if (token && userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }
  
  return null;
};