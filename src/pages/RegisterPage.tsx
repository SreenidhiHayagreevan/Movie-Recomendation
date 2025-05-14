import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Lock, User, Mail } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

// API base URL - Using Vite env variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://ec2-3-14-28-95.us-east-2.compute.amazonaws.com:5000";

// interface RegisterResponse {
//   success: boolean;
//   token?: string;
//   user?: {
//     id: string;
//     name: string;
//     email: string;
//   };
//   message?: string;
// }

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  // const { register } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Direct API call for debugging
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });
      
      const data = await response.json();
      console.log('Registration response:', data);
      
      if (data.success) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        // Save user info
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/movies');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
              <label htmlFor="name" className="block text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="input pl-10"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="input pl-10"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
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
                  onChange={handlePasswordChange}
                  className="input pl-10"
                  placeholder="Enter password"
                  autoComplete="new-password"
                  required
                  minLength={6}
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
                  Registering...
                </div>
              ) : (
                'Register'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-gray-400 text-sm">
            Already have an account? <a href="/login" className="text-primary hover:underline">Log in</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
