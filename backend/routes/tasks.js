const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from header
  if (!token) return res.sendStatus(401); // Unauthorized if no token is present
  try {
    req.user = jwt.verify(token, 'secretKey'); // Verify token
    next(); // Proceed if token is valid
  } catch (err) {
    res.sendStatus(403); // Forbidden if token is invalid
  }
}

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Get tasks (created by or assigned to the user)
router.get('/', async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      // If user is an admin, fetch all tasks with populated user details
      tasks = await Task.find().populate('createdBy assignedTo', 'name email');
    } else {
      // If not admin, fetch tasks that are either created by or assigned to the user
      tasks = await Task.find({
        $or: [
          { createdBy: req.user.userId }, 
          { assignedTo: req.user.userId }
        ]
      }).populate('createdBy assignedTo', 'name email'); // Populate createdBy and assignedTo with user details
    }
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task({ ...req.body, createdBy: req.user.userId }); // Set createdBy to the current user's ID
    await task.save();
    res.status(201).send(task); // Send created task back in response
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(400).send({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(task); // Send updated task back in response
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(400).send({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id); // Delete task by ID
    res.send({ message: 'Task deleted' }); // Send success message
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send({ error: 'Failed to delete task' });
  }
});

module.exports = router;
