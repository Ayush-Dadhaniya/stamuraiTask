import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async () => {
    await api.post('/auth/register', form);
    router.push('/login');
  };

  return (
    <div>
      <h1>Register</h1>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}
