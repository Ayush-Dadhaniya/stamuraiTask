const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, 'secretKey');
    next();
  } catch {
    res.sendStatus(403);
  }
}

router.use(authMiddleware);

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task({ ...req.body, createdBy: req.user.userId });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(400).send({ error: 'Failed to create task' });
  }
});

// Get tasks (created by or assigned to the user), with usernames populated
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user.userId },
        { assignedTo: req.user.userId }
      ]
    })
      .populate('assignedTo', 'username') // Populate assignedTo with username
      .populate('createdBy', 'username'); // Populate createdBy with username

    res.send(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).send({ error: 'Failed to fetch tasks' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(400).send({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.send({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send({ error: 'Failed to delete task' });
  }
});

module.exports = router;
