import { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Link from 'next/link';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', dueDate: '' });
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get('https://stamuraitask-production.up.railway.app/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Error loading tasks', err));

    axios
      .get('https://stamuraitask-production.up.railway.app/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error loading users', err));
  }, [token]);

  const refreshTasks = () => {
    if (!token) return;

    axios
      .get('https://stamuraitask-production.up.railway.app/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Error loading tasks', err));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`https://stamuraitask-production.up.railway.app/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshTasks();
    } catch (err) {
      console.error('Error deleting task', err);
    }
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    const matchesFilters =
      (!filters.status || task.status === filters.status) &&
      (!filters.priority || task.priority === filters.priority) &&
      (!filters.dueDate || task.dueDate.slice(0, 10) === filters.dueDate);

    return matchesSearch && matchesFilters;
  });

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200 p-4 sm:p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 sm:mb-0">
          Your Dashboard 🧠✨
        </h1>
        <Link href="/">
          <a className="inline-block px-5 py-2 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition">
            🏠 Home
          </a>
        </Link>
      </div>

      <div className="mb-8">
        <TaskForm
          refreshTasks={refreshTasks}
          token={token}
          users={users}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🔍 Filter Tasks</h2>

        <div className="flex flex-wrap gap-3">
          <input
            className="flex-1 min-w-[160px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
            type="text"
            placeholder="Search by title or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-md text-sm"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="px-4 py-2 border rounded-md text-sm"
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
          <input
            className="px-4 py-2 border rounded-md text-sm"
            type="date"
            onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Your Tasks</h2>
        {filteredTasks.length === 0 ? (
          <p className="text-gray-600 text-center">No matching tasks found 🚫</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                isOverdue={isOverdue}
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
