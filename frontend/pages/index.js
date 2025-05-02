import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Task Management System</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
        Organize, assign, and manage your team’s tasks efficiently.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/login">
          <a className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg transition">
            Login
          </a>
        </Link>
        <Link href="/register">
          <a className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full text-lg transition">
            Register
          </a>
        </Link>

        {isLoggedIn && (
          <Link href="/dashboard">
            <a className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg transition">
              Go to Dashboard
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
