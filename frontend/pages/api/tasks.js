import dbConnect from './_utils/db';
import Task from './_models/Task';
import User from './_models/User';
import authMiddleware from './_utils/auth';
import sendAssignmentEmail from './_utils/mailer';

export default async function handler(req, res) {
  // Connect to database
  await dbConnect();

  // Authenticate user
  let user;
  try {
    user = authMiddleware(req);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }

  if (req.method === 'GET') {
    try {
      let tasks;

      if (user.role === 'admin') {
        tasks = await Task.find().populate('createdBy assignedTo', 'name email');
      } else {
        tasks = await Task.find({
          $or: [
            { createdBy: user.userId },
            { assignedTo: user.userId }
          ]
        }).populate('createdBy assignedTo', 'name email');
      }

      res.json(tasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  } else if (req.method === 'POST') {
    try {
      const task = new Task({
        ...req.body,
        createdBy: user.userId
      });

      await task.save();

      // Send email if task is assigned
      if (task.assignedTo) {
        const [assignedUser, currentUser] = await Promise.all([
          User.findById(task.assignedTo),
          User.findById(user.userId)
        ]);

        if (assignedUser?.email && currentUser?.name) {
          await sendAssignmentEmail(assignedUser.email, task.title, currentUser.name);
        }
      }

      res.status(201).json(task);
    } catch (err) {
      console.error('Error creating task:', err);
      res.status(400).json({ message: 'Failed to create task' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true }).populate('assignedTo createdBy', 'name email');

      if (req.body.assignedTo) {
        const [assignedUser, currentUser] = await Promise.all([
          User.findById(req.body.assignedTo),
          User.findById(user.userId)
        ]);

        if (assignedUser?.email && currentUser?.name) {
          await sendAssignmentEmail(assignedUser.email, updatedTask.title, currentUser.name);
        }
      }

      res.json(updatedTask);
    } catch (err) {
      console.error('Error updating task:', err);
      res.status(400).json({ message: 'Failed to update task' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await Task.findByIdAndDelete(id);
      res.json({ message: 'Task deleted' });
    } catch (err) {
      console.error('Error deleting task:', err);
      res.status(500).json({ message: 'Failed to delete task' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 