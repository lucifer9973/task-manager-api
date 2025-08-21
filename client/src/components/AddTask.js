import React, { useState } from 'react';
import axios from 'axios';

const AddTask = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/tasks',
        { title: title.trim(), description: description.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTitle('');
      setDescription('');
      onTaskAdded();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="card-header">
        <h3 className="card-title">✨ Add New Task</h3>
        <p className="card-subtitle">Create a new task to stay organized</p>
      </div>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label className="form-label" htmlFor="task-title">
            📝 Task Title
          </label>
          <input
            type="text"
            id="task-title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-description">
            📋 Description (Optional)
          </label>
          <textarea
            id="task-description"
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about this task..."
            rows="3"
            style={{ resize: 'vertical' }}
          />
        </div>

        <button 
          type="submit" 
          className="modern-btn" 
          disabled={loading || !title.trim()}
        >
          {loading ? (
            <>
              <span className="loading"></span>
              Adding Task...
            </>
          ) : (
            '🚀 Add Task'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
