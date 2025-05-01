import { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', dueDate: '' });
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Access localStorage only on the client side
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get('http://localhost:5000/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Error loading tasks', err));
  }, [token]);

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
    return <p className="p-4">Loading...</p>; // or redirect to login
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <TaskForm />

      <div className="mt-4 mb-2">
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 mr-2"
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="border p-2 mr-2"
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          className="border p-2"
          type="date"
          onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Filtered Tasks</h2>
        {filteredTasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} isOverdue={isOverdue(task.dueDate, task.status)} />
          ))
        )}
      </div>
    </div>
  );
}
