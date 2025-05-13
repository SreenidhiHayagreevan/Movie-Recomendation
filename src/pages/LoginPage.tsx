import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    try {
  const success = await login(username, password);
  if (success) {
    // After login, get the current user from useAuth
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user?.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/movies');
    }
  }
} catch (err) {
  setError('Invalid credentials. Please try again.');
}
 
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-secondary-light rounded-lg shadow-xl overflow-hidden w-full max-w-md">
        <div className="bg-primary p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-3">
              <Film size={32} className="text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Login</h1>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-gray-400 text-sm">
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
