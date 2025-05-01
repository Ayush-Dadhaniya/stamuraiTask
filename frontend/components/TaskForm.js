import { useEffect, useState } from 'react';
import axios from 'axios';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    status: '',
    assignedTo: '',
  });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true); // Loading state for users
  const [error, setError] = useState(''); // Error state for users fetch
  const [loadingTask, setLoadingTask] = useState(false); // Loading state for task creation

  // Fetch users for the "Assign to" dropdown
  useEffect(() => {
    setLoadingUsers(true); // Set loading state to true
    axios
      .get('http://localhost:5000/users')
      .then((res) => {
        setUsers(res.data);
        setLoadingUsers(false); // Set loading state to false once data is fetched
      })
      .catch((err) => {
        console.error('Error fetching users', err);
        setError('Failed to load users');
        setLoadingUsers(false); // Set loading state to false on error
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingTask(true); // Set task creation loading to true
    setError(''); // Reset error message

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Task created');
      setFormData({ // Reset the form after successful submission
        title: '',
        description: '',
        dueDate: '',
        priority: '',
        status: '',
        assignedTo: '',
      });
    } catch (err) {
      console.error(err);
      setError('Error creating task');
    } finally {
      setLoadingTask(false); // Set task creation loading to false after the request
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        required
      />
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        required
      >
        <option value="">Priority</option>
        <option value="Low">Low</option>
        <option value="Normal">Normal</option>
        <option value="High">High</option>
      </select>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="">Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* User dropdown */}
      {loadingUsers ? (
        <p>Loading users...</p> // Display loading state while fetching users
      ) : error ? (
        <p className="text-red-500">{error}</p> // Display error if users fetch fails
      ) : (
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          required
        >
          <option value="">Assign to</option>
          {users.map((user) => (
            <option key={user._id} className="text-black" value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      )}

      <button type="submit" disabled={loadingTask}>
        {loadingTask ? 'Creating Task...' : 'Create Task'}
      </button>

      {error && <p className="text-red-500">{error}</p>} {/* Error display if task creation fails */}
    </form>
  );
};

export default TaskForm;
