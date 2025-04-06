import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiPlus, FiSearch, FiLogOut, FiUser, FiMenu, FiX, FiTag, FiStar } from 'react-icons/fi';
import useStore from '../../store/useStore';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      <div className="mobile-header">
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <FiX /> : <FiMenu />}
        </button>
        <h2>Notes App</h2>
        <div className="user-avatar">
          {user && user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>

      <aside className={`sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Notes App</h2>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            {user && user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <h3>{user ? user.fullName : 'User'}</h3>
            <p>{user ? user.email : 'user@example.com'}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <FiHome /> <span>Home</span>
          </Link>
          <Link to="/dashboard/new" className={`nav-item ${isActive('/dashboard/new') ? 'active' : ''}`}>
            <FiPlus /> <span>Create Note</span>
          </Link>
          <Link to="/dashboard/starred" className={`nav-item ${isActive('/dashboard/starred') ? 'active' : ''}`}>
            <FiStar /> <span>Starred</span>
          </Link>
          <Link to="/dashboard/tags" className={`nav-item ${isActive('/dashboard/tags') ? 'active' : ''}`}>
            <FiTag /> <span>Tags</span>
          </Link>
          <Link to="/dashboard/profile" className={`nav-item ${isActive('/dashboard/profile') ? 'active' : ''}`}>
            <FiUser /> <span>Profile</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 