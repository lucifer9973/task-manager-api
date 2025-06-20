import React, { useState } from 'react';
import axios from 'axios';

const AddTask = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { title, description });
      setTitle('');
      setDescription('');
      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <input 
        type="text" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTask;
