const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const router = express.Router();

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

router.post('/', async (req, res) => {
  const task = new Task({ ...req.body, createdBy: req.user.userId });
  await task.save();
  res.status(201).send(task);
});

router.get('/', async (req, res) => {
  const tasks = await Task.find({ $or: [{ createdBy: req.user.userId }, { assignedTo: req.user.userId }] });
  res.send(tasks);
});

router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(task);
});

router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: 'Task deleted' });
});

module.exports = router;
