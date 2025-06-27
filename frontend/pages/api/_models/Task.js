const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],  // Add the valid statuses
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],  // Add the valid priorities
    default: 'normal'
  },
  dueDate: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

module.exports = Task; 