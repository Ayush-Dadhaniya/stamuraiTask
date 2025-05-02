import { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import Link from 'next/link';

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setToken(null);
      return;
    }
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const res = await axios.get('https://stamuraitask-production.up.railway.app/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error('Error loading tasks', err);
      }
    };

    fetchTasks();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200 p-4 sm:p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 sm:mb-0">
          Admin Dashboard 🧠✨
        </h1>
        <Link href="/">
          <span className="inline-block px-5 py-2 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer">
            🏠 Home
          </span>
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 All Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-600 text-center">No tasks found 🚫</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
