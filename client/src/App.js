import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleTaskAdded = () => {
    setRefresh(prev => prev + 1);
  };

  const switchToRegister = () => setShowLogin(false);
  const switchToLogin = () => setShowLogin(true);

  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <span className="loading"></span>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-container">
        <div className="auth-container">
          <div className="auth-header">
            <div className="logo-container">
              <div className="logo-icon">📋</div>
              <h1 className="logo-text">TaskMaster</h1>
            </div>
            <p className="auth-subtitle">Organize your life, one task at a time</p>
          </div>
          
          {showLogin ? (
            <Login onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
          ) : (
            <Register onRegister={handleLogin} onSwitchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <div className="logo-icon">📋</div>
              <h1 className="logo-text">TaskMaster</h1>
            </div>
          </div>
          
          <div className="header-center">
            <h2 className="welcome-text">
              Welcome back, <span className="user-name">{user.name}</span>
              {isAdmin && <span className="admin-badge">👑 ADMIN</span>}
            </h2>
          </div>
          
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {isAdmin ? (
          <div className="admin-container">
            <AdminDashboard />
          </div>
        ) : (
          <div className="user-container">
            <AddTask onTaskAdded={handleTaskAdded} />
            <TaskList key={refresh} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;