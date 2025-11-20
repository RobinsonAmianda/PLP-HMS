// components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import API_BASE from '../apiConfig';

const Navbar = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleLogout = () => {
    if (typeof logout === 'function') logout();
    if (typeof onLogout === 'function') onLogout();
    setOpen(false);
    navigate('/');
  };

  const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp&s=120';

  return (
   <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Premium Professional Navbar</title>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        .nav-link {\n            position: relative;\n            transition: all 0.3s ease;\n        }\n        .nav-link::after {\n            content: '';\n            position: absolute;\n            width: 0;\n            height: 2px;\n            bottom: -4px;\n            left: 0;\n            background-color: currentColor;\n            transition: width 0.3s ease;\n        }\n        .nav-link:hover::after {\n            width: 100%;\n        }\n        .dropdown:hover .dropdown-menu {\n            opacity: 1;\n            visibility: visible;\n            transform: translateY(0);\n        }\n        .dropdown-menu {\n            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n        }\n        .mobile-menu {\n            max-height: 0;\n            overflow: hidden;\n            transition: max-height 0.3s ease-out;\n        }\n        .mobile-menu.open {\n            max-height: 1000px;\n            transition: max-height 0.5s ease-in;\n        }\n        .badge {\n            font-size: 0.65rem;\n            top: -0.5rem;\n            right: -0.5rem;\n        }\n        .avatar-ring {\n            box-shadow: 0 0 0 2px white, 0 0 0 4px #3B82F6;\n        }\n    "
    }}
  />
  {/* Premium Professional Navigation Bar */}
<nav className="bg-white shadow-lg sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      {/* Left Section - Logo/Brand */}
      <div className="flex items-center">
        <NavLink to="/" className="flex items-center group">
          <div className="bg-blue-600 group-hover:bg-blue-700 p-2 rounded-lg transition-colors duration-300">
            <i className="fas fa-cube text-white text-xl" />
          </div>
          <span className="ml-3 text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            AfyaBora
          </span>
        </NavLink>
      </div>
      
      {/* Center Section - Main Navigation (Desktop) */}
      <div className="hidden md:flex items-center space-x-1">
        <NavLink to="/" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>
          Home
        </NavLink>
        {user && user.role === 'admin' && (
          <>
            <NavLink to="/admin" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>Dashboard</NavLink>
            <NavLink to="/patients" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>Patients</NavLink>
            <NavLink to="/doctors" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>Doctors</NavLink>
            <NavLink to="/appointments" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>Appointments</NavLink>
            <NavLink to="/payments" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>Payments</NavLink>
          </>
        )}
        {user && user.role === 'doctor' && (
          <>
            <NavLink to="/patients" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>Patients</NavLink>
            <NavLink to="/appointments" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>Appointments</NavLink>
            <NavLink to="/doctors" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>Doctors</NavLink>
          </>
        )}
        {user && user.role === 'patient' && (
          <>
            <NavLink to="/doctors" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>Doctors</NavLink>
            <NavLink to="/appointments" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>Appointments</NavLink>
            <NavLink to="/payments" className={({ isActive }) => `nav-link text-gray-700 hover:text-blue-600 px-4 py-2 flex items-center rounded-lg hover:bg-blue-50 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`}>Payments</NavLink>
          </>
        )}
      </div>

      {/* Right Section - Profile */}
      <div className="flex items-center">
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setOpen(!open)} className="flex items-center focus:outline-none relative">
            <img
              src={(user && user.profilePic && (user.profilePic.startsWith('http') ? user.profilePic : API_BASE + user.profilePic)) || defaultAvatar}
              alt="profile"
              className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            {/* {user && user.role && (
              <span className="absolute -top-1 -right-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-semibold" title={user.role}>
                {user.role.substring(0,3).toUpperCase()}
              </span>
            )} */}
          </button>
          {open && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-2 px-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded" onClick={() => setOpen(false)}>Profile</NavLink>
                <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</nav>
  {/* JavaScript for enhanced functionality */}
</>

  );
};
export default Navbar;
