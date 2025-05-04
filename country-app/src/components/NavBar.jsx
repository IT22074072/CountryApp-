import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const goToFavorites = () => {
    navigate('/favorites');
  };

  const goToHome = () => {
    navigate('/home');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-purple-400 to-indigo-500 shadow-xl rounded-b-xl">
      <button onClick={goToHome}>
        <h1 className="text-3xl font-bold text-white tracking-wide">🌍 GeoPortal</h1>
      </button>
      <div className="space-x-4 hidden md:flex">
      {isAuthenticated ? (
  <>
    <button
      onClick={goToFavorites}
      className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-md hover:from-purple-600 hover:to-indigo-700 transition-transform duration-300 transform hover:scale-105"
    >
      Favorites
    </button>
    <button
      onClick={handleLogout}
      className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-400 to-red-600 rounded-xl shadow-md hover:from-red-500 hover:to-red-700 transition-transform duration-300 transform hover:scale-105"
    >
      Logout
    </button>
  </>
) : (
  <>
    <button
      onClick={handleLogin}
      className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-md hover:from-purple-600 hover:to-indigo-700 transition-transform duration-300 transform hover:scale-105"
    >
      Login
    </button>
    <button
      onClick={handleSignup}
      className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-md hover:from-green-500 hover:to-green-700 transition-transform duration-300 transform hover:scale-105"
    >
      Signup
    </button>
  </>
)}

      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button className="text-white" onClick={() => console.log("Toggle Menu")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
