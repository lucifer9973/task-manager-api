import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all data in parallel
      const [usersRes, tasksRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUsers(usersRes.data);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
      setError('');
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/tasks/${taskId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}" and all their tasks?`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="glass-card">
        <div className="loading-container">
          <span className="loading"></span>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card">
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button className="modern-btn btn-secondary" onClick={fetchAdminData}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <div className="glass-card admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <h2>🔐 Admin Dashboard</h2>
            <p>Full system access - Manage all users and tasks</p>
          </div>
          <div className="admin-actions">
            <button className="modern-btn btn-secondary" onClick={fetchAdminData}>
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          👥 Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
        >
          📋 Tasks ({tasks.length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="overview-content">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number">{stats?.totalUsers || 0}</div>
              <div className="stat-label">Total Users</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-number">{stats?.totalTasks || 0}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-number">{stats?.taskStatus?.pending || 0}</div>
              <div className="stat-label">Pending</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-number">{stats?.taskStatus?.inProgress || 0}</div>
              <div className="stat-label">In Progress</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-number">{stats?.taskStatus?.completed || 0}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card">
            <h3 className="card-title">🕒 Recent Activity</h3>
            <div className="recent-tasks">
              {tasks.slice(0, 5).map((task, index) => (
                <div key={task._id} className="recent-task-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="recent-task-content">
                    <strong>{task.title}</strong>
                    <span className="recent-task-user">by {task.user?.name || 'Unknown User'}</span>
                  </div>
                  <div className="recent-task-meta">
                    <span className={`status-badge status-${task.status}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                    <span className="recent-task-date">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="glass-card">
          <h3 className="card-title">👥 All Users ({users.length})</h3>
          <div className="users-grid">
            {users.map((user, index) => (
              <div key={user._id} className="user-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h4 className="user-name">{user.name}</h4>
                    <p className="user-email">{user.email}</p>
                    <div className="user-meta">
                      <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                      <span className="user-date">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => deleteUser(user._id, user.name)}
                    className="action-btn btn-delete"
                    title="Delete user"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="glass-card">
          <h3 className="card-title">📋 All Tasks ({tasks.length})</h3>
          <div className="admin-tasks-grid">
            {tasks.map((task, index) => (
              <div key={task._id} className="admin-task-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="admin-task-content">
                  <div className="admin-task-header">
                    <h4 className="admin-task-title">{task.title}</h4>
                    <div className="admin-task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="in-progress">🚀 In Progress</option>
                        <option value="completed">✅ Completed</option>
                      </select>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="action-btn btn-delete"
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="admin-task-description">{task.description}</p>
                  )}
                  
                  <div className="admin-task-meta">
                    <div className="task-owner">
                      <strong>Owner:</strong> {task.user?.name || 'Unknown'} ({task.user?.email || 'No email'})
                    </div>
                    <div className="task-dates">
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      {task.updatedAt && (
                        <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`status-badge status-${task.status}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
