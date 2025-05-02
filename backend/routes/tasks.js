const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendAssignmentEmail = require('../utils/mailer');

const router = express.Router();

// Middleware to verify JWT token and attach user info to request
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Malformed token' });

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(403).json({ message: 'Invalid token' });
  }
}

// Apply the middleware to all task routes
router.use(authMiddleware);

// ✅ GET all tasks (admin sees all, user sees relevant)
router.get('/', async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      // Admin sees all tasks with user info populated
      tasks = await Task.find().populate('createdBy assignedTo', 'name email');
    } else {
      // Regular users see tasks they created or are assigned to
      tasks = await Task.find({
        $or: [
          { createdBy: req.user.userId },
          { assignedTo: req.user.userId }
        ]
      }).populate('createdBy assignedTo', 'name email');
    }

    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// ✅ POST create a task
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user.userId
    });

    await task.save();

    // Send assignment email if applicable
    if (task.assignedTo) {
      const assignedUser = await User.findById(task.assignedTo);
      if (assignedUser && assignedUser.email) {
        await sendAssignmentEmail(assignedUser.email, task.title, req.user.name || 'Someone');
      }
    }

    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(400).json({ message: 'Failed to create task' });
  }
});

// ✅ PUT update a task
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedTo createdBy', 'name email');

    // If reassigned, send email to new assignee
    if (req.body.assignedTo) {
      const assignedUser = await User.findById(req.body.assignedTo);
      if (assignedUser && assignedUser.email) {
        await sendAssignmentEmail(assignedUser.email, updatedTask.title, req.user.name || 'Someone');
      }
    }

    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(400).json({ message: 'Failed to update task' });
  }
});

// ✅ DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

module.exports = router;
