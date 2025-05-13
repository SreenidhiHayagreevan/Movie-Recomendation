// Simulating authentication service that would interact with Django backend

interface LoginResponse {
  id: number;
  username: string;
  isAdmin: boolean;
  token: string;
}

// This would be replaced with actual API calls to Django
export const loginUserOld = async (username: string, password: string) => {
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

export const loginUserV2 = async (username: string, password: string) => {
  const usersRaw = localStorage.getItem('registeredUsers');
  const users = usersRaw ? JSON.parse(usersRaw) : {};

  // Admin hardcoded
  if (username === 'admin' && password === 'admin') {
    const adminData = { id: 1, username: 'admin', isAdmin: true };
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(adminData));
    return adminData;
  }

  const user = users[username];
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  const userData = { id: Date.now(), username, isAdmin: false };
  localStorage.setItem('authToken', 'mock-user-token');
  localStorage.setItem('user', JSON.stringify(userData));

  return userData;
};

export const loginUser = async (username: string, password: string) => {
  const usersRaw = localStorage.getItem('registeredUsers');
  const users = usersRaw ? JSON.parse(usersRaw) : {};

  // 1. Admin login (hardcoded)
  if (username === 'admin' && password === 'admin') {
    const adminData = { id: 1, username: 'admin', isAdmin: true };
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(adminData));
    return adminData;
  }

  // 2. Check registered users from localStorage
  const user = users[username];
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  // 3. Return stored user object (ensure ID and isAdmin exist)
  const userData = {
    id: user.id || Date.now(),
    username,
    isAdmin: false,
  };

  // Save session
  localStorage.setItem('authToken', 'mock-user-token');
  localStorage.setItem('user', JSON.stringify(userData));

  return userData;
};



export const logoutUser = async () => {
  // In a real app, this would be an API call to Django's auth system
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  return true;
};


export const registerUser = async (username: string, password: string) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const usersRaw = localStorage.getItem('registeredUsers');
  const users = usersRaw ? JSON.parse(usersRaw) : {};

  if (users[username]) {
    throw new Error('Username already exists');
  }

  users[username] = { username, password };
  localStorage.setItem('registeredUsers', JSON.stringify(users));
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
