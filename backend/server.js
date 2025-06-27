const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Task Management API is running' });
});

// Only listen on a port if not in Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(5000, () => console.log('Server running on http://localhost:5000'));
}

module.exports = app;
