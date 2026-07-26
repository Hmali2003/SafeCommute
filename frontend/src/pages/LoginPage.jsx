import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../services/authService';
import api from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
try {
  const loginData = await signIn(form);

  console.log("LOGIN DATA:", loginData);
  console.log("SESSION:", loginData.session);
  console.log("ACCESS TOKEN:", loginData.session?.access_token);

  const { data } = await api.get('/api/auth/me');

  console.log("USER DATA FROM BACKEND:", data);

  navigate(data.role === 'manager' ? '/manager' : '/employee');

} catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link to="/" className="text-primary-700 font-bold text-lg">SafeCommute</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-6">Log in</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}