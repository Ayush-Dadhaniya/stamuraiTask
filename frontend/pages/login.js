import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';
import { saveToken } from '../utils/auth';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', form);
      saveToken(res.data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back 👋</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Login to your account to get started</p>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 text-sm"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 text-sm"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition text-sm"
        >
          Log In
        </button>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link href="/register">
            <button className="text-purple-600 font-medium hover:underline">Register</button>
          </Link>
        </p>
      </div>
    </div>
  );
}
