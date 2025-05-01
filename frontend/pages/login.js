import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';
import { saveToken } from '../utils/auth';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    const res = await api.post('/auth/login', form);
    saveToken(res.data.token);
    router.push('/dashboard');
  };

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
