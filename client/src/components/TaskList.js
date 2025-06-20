import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div>
      <h2>Task List</h2>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        tasks.map(task => (
          <div key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
