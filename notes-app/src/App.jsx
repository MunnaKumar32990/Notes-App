import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Homepage from './components/HomePage';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import useStore from './store/useStore';
import axios from 'axios';

const App = () => {
  const { user, darkMode, setUser } = useStore();

  useEffect(() => {
    // Apply dark mode to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    // Check if token exists and fetch user data
    const token = localStorage.getItem('token');
    if (token && !user) {
      const fetchUser = async () => {
        try {
          const response = await axios.get('/api/get-user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data && response.data.user) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // If token is invalid, remove it
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
          }
        }
      };
      fetchUser();
    }
  }, [user, setUser]);

  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: darkMode ? '#334155' : '#ffffff',
            color: darkMode ? '#f1f5f9' : '#334155',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
        
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/dashboard/new" element={<Home mode="create" />} />
            <Route path="/dashboard/starred" element={<Home filter="starred" />} />
            <Route path="/dashboard/tags" element={<Home filter="tags" />} />
            <Route path="/dashboard/profile" element={<Home mode="profile" />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
