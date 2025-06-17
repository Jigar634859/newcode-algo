import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout', {}, {
        withCredentials: true 
      });
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl font-bold text-blue-600">CodeAlgo</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
