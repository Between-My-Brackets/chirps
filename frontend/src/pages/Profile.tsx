import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { Navigate } from 'react-router-dom';
import * as api from '../lib/api';
import type { Chirp } from '../lib/api';

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [chirps, setChirps] = useState<Chirp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .getChirps('desc', user.id)
      .then(setChirps)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <div className="rounded-xl border border-mongo-border bg-mongo-panel p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-mongo-white">
              Profile
            </h1>
            <p className="mt-1 text-sm text-mongo-gray">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-mongo-border px-4 py-2 text-sm font-medium text-mongo-gray transition-colors hover:border-red-500/50 hover:text-red-400 cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-mongo-border bg-mongo-black p-4 text-center">
            <p className="text-2xl font-bold text-mongo-green">
              {loading ? '—' : chirps.length}
            </p>
            <p className="mt-1 text-xs text-mongo-gray">Chirps</p>
          </div>
          <div className="rounded-lg border border-mongo-border bg-mongo-black p-4 text-center">
            <p className="text-2xl font-bold text-mongo-green">
              {user?.isChirpyRed ? '⭐' : '—'}
            </p>
            <p className="mt-1 text-xs text-mongo-gray">Chirpy Red</p>
          </div>
        </div>
      </div>

      {/* User's chirps */}
      <h2 className="mt-8 text-lg font-bold text-mongo-white">Your Chirps</h2>
      <div className="mt-4 flex flex-col gap-3">
        {loading ? (
          <div className="py-10 text-center text-mongo-gray">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-mongo-green border-t-transparent" />
          </div>
        ) : chirps.length === 0 ? (
          <div className="py-10 text-center text-mongo-gray">
            <p className="text-sm">You haven't posted any chirps yet.</p>
          </div>
        ) : (
          chirps.map((chirp) => (
            <div
              key={chirp.id}
              className="rounded-xl border border-mongo-border bg-mongo-panel p-4"
            >
              <p className="text-sm leading-relaxed text-mongo-white whitespace-pre-wrap break-words">
                {chirp.body}
              </p>
              <p className="mt-2 text-xs text-mongo-gray/60">
                {timeAgo(chirp.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
