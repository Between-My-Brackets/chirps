import { useState, type FormEvent } from 'react';
import { useAuth } from '../components/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../lib/api';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 409
            ? 'An account with this email already exists'
            : err.message,
        );
      } else {
        setError('Something went wrong. Is the backend running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-6">
      <div className="w-full">
        <h1 className="text-3xl font-extrabold tracking-tight text-mongo-white">
          Create an account
        </h1>
        <p className="mt-2 text-mongo-gray">
          Join Chirpy and start sharing your thoughts.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-mongo-gray">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-mongo-border bg-mongo-panel px-4 py-2.5 text-sm text-mongo-white placeholder-mongo-gray/50 outline-none transition-colors focus:border-mongo-green"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-mongo-gray">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-mongo-border bg-mongo-panel px-4 py-2.5 text-sm text-mongo-white placeholder-mongo-gray/50 outline-none transition-colors focus:border-mongo-green"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-mongo-gray">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border border-mongo-border bg-mongo-panel px-4 py-2.5 text-sm text-mongo-white placeholder-mongo-gray/50 outline-none transition-colors focus:border-mongo-green"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-mongo-green py-2.5 text-sm font-semibold text-mongo-black transition-colors hover:bg-mongo-green/85 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mongo-gray">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-mongo-green hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
