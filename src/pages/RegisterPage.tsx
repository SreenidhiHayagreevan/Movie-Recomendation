import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();

  const navigate = useNavigate();


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // ✅ Prevent page refresh
  const success = await register(username, password);
  if (success) {
    navigate('/movies');
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
          <h1 className="text-2xl font-bold text-white">Register</h1>
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
                'Register'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>Hint: For demo purposes, use:</p>
            <p className="font-medium">Username: admin / Password: admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
