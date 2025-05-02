import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TaskForm({ refreshTasks, token, users, editingTask, setEditingTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
      setDueDate(editingTask.dueDate.slice(0, 10));
      setAssignedTo(editingTask.assignedTo?._id || '');
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
    };

    try {
      if (editingTask) {
        await axios.put(`http://localhost:5000/tasks/${editingTask._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingTask(null);
      } else {
        await axios.post('http://localhost:5000/tasks', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('normal');
      setStatus('pending');
      setDueDate('');
      setAssignedTo('');
      refreshTasks();
    } catch (err) {
      console.error('Task save error', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {editingTask ? '✏️ Edit Task' : '➕ Create New Task'}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className="p-2 border rounded"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="p-2 border rounded"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <select
          className="p-2 border rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        <select
          className="p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="p-2 border rounded"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        <textarea
          className="p-2 border rounded sm:col-span-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="mt-4 flex justify-between">
        <button
          type="submit"
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
        {editingTask && (
          <button
            type="button"
            onClick={() => setEditingTask(null)}
            className="text-sm text-gray-600 underline"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}
