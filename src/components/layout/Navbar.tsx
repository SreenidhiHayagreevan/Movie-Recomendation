import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Search, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-secondary-dark shadow-lg py-4">
      <div className="container-custom mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center space-x-2">
            <Film size={28} className="text-primary" />
            <span className="text-xl font-bold text-white">MovieMate</span>
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/movies" className="text-gray-300 hover:text-white transition-colors">
              Movies
            </Link>
            <Link to="/recommendations" className="text-gray-300 hover:text-white transition-colors">
              Recommendations
            </Link>
            
            {/* Search form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary-light text-white px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Search size={18} className="text-gray-400" />
              </button>
            </form>
            
            {/* Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/admin" className="flex items-center text-gray-300 hover:text-white">
                  <User size={18} className="mr-1" />
                  <span>{user?.username}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-300 hover:text-white"
                >
                  <LogOut size={18} className="mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-300 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 animate-fade-in">
            <div className="flex flex-col space-y-4 pt-2 pb-3">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/movies" 
                className="text-gray-300 hover:text-white px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Movies
              </Link>
              <Link 
                to="/recommendations" 
                className="text-gray-300 hover:text-white px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Recommendations
              </Link>
              
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary-light text-white px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Search size={18} className="text-gray-400" />
                </button>
              </form>
              
              {/* Mobile authentication */}
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/admin" 
                    className="flex items-center text-gray-300 hover:text-white px-2 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} className="mr-2" />
                    <span>{user?.username}</span>
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center text-gray-300 hover:text-white px-2 py-1"
                  >
                    <LogOut size={18} className="mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="btn btn-primary w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-secondary w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
