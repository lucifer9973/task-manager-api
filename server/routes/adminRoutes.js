const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Apply both authentication and admin authorization to all admin routes
router.use(auth);
router.use(adminAuth);

// GET all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Admin users fetch error:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// GET all tasks from all users (admin only)
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Admin tasks fetch error:', err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// GET user by ID with their tasks (admin only)
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const tasks = await Task.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json({ user, tasks });
  } catch (err) {
    console.error('Admin user fetch error:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// PUT update any task (admin only)
router.put('/tasks/:taskId', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { $set: req.body },
      { new: true }
    ).populate('user', 'name email');
    
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(updatedTask);
  } catch (err) {
    console.error('Admin task update error:', err);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// DELETE any task (admin only)
router.delete('/tasks/:taskId', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Admin task delete error:', err);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// DELETE user and all their tasks (admin only)
router.delete('/users/:userId', async (req, res) => {
  try {
    // Delete all tasks for this user first
    await Task.deleteMany({ user: req.params.userId });
    
    // Then delete the user
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User and all their tasks deleted successfully' });
  } catch (err) {
    console.error('Admin user delete error:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// GET system statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    
    res.json({
      totalUsers,
      totalTasks,
      taskStatus: {
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router;
