import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../components/AuthProvider';
import * as api from '../lib/api';
import type { Chirp } from '../lib/api';

// ── Helpers ──

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

function avatarColor(userId: string): string {
  const colors = [
    'bg-emerald-500', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500',
    'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-lime-500',
  ];
  let hash = 0;
  for (const ch of userId) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return colors[Math.abs(hash) % colors.length];
}

// ── Compose Box ──

function ComposeBox({ onPost }: { onPost: (chirp: Chirp) => void }) {
  const { token } = useAuth();
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const remaining = 140 - body.length;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !token) return;
    setLoading(true);
    setError('');
    try {
      const chirp = await api.createChirp(body.trim(), token);
      setBody('');
      onPost(chirp);
    } catch (err) {
      setError(err instanceof api.ApiError ? err.message : 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-mongo-border bg-mongo-panel p-5"
    >
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={140}
        rows={3}
        placeholder="What's happening?"
        className="w-full resize-none border-none bg-transparent text-sm text-mongo-white placeholder-mongo-gray/50 outline-none"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-xs font-medium ${
            remaining < 20
              ? remaining < 0
                ? 'text-red-400'
                : 'text-amber-400'
              : 'text-mongo-gray/60'
          }`}
        >
          {remaining}
        </span>
        <button
          type="submit"
          disabled={loading || !body.trim() || remaining < 0}
          className="rounded-lg bg-mongo-green px-5 py-2 text-sm font-semibold text-mongo-black transition-colors hover:bg-mongo-green/85 disabled:opacity-40 cursor-pointer"
        >
          {loading ? 'Posting…' : 'Chirp'}
        </button>
      </div>
    </form>
  );
}

// ── Chirp Card ──

function ChirpCard({
  chirp,
  onDelete,
  isOwn,
}: {
  chirp: Chirp;
  onDelete: (id: string) => void;
  isOwn: boolean;
}) {
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="flex gap-3 rounded-xl border border-mongo-border bg-mongo-panel p-5 transition-colors hover:border-mongo-green/20">
      {/* Avatar */}
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColor(
          chirp.userId,
        )}`}
      >
        {chirp.userId.slice(0, 2).toUpperCase()}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-mongo-white">
            {chirp.userId.slice(0, 8)}…
          </span>
          <span className="text-xs text-mongo-gray/60">
            {timeAgo(chirp.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-mongo-gray whitespace-pre-wrap break-words">
          {chirp.body}
        </p>
      </div>

      {/* Delete */}
      {isOwn && (
        <button
          onClick={async () => {
            setDeleting(true);
            onDelete(chirp.id);
          }}
          disabled={deleting}
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-mongo-gray/40 transition-colors hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
          aria-label="Delete chirp"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

// ── Feed Page ──

export default function Feed() {
  const { isAuthenticated, user, token } = useAuth();
  const [chirps, setChirps] = useState<Chirp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchChirps = async () => {
    try {
      const data = await api.getChirps('desc');
      setChirps(data);
      setError('');
    } catch {
      setError('Could not load chirps. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChirps();
  }, []);

  const handlePost = (chirp: Chirp) => {
    setChirps((prev) => [chirp, ...prev]);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await api.deleteChirp(id, token);
      setChirps((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-mongo-white">
        Feed
      </h1>
      <p className="mt-1 text-sm text-mongo-gray">
        The latest chirps from the community.
      </p>

      {/* Compose */}
      {isAuthenticated && (
        <div className="mt-6">
          <ComposeBox onPost={handlePost} />
        </div>
      )}

      {/* Chirps */}
      <div className="mt-8 flex flex-col gap-3">
        {loading ? (
          <div className="py-16 text-center text-mongo-gray">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-mongo-green border-t-transparent" />
            <p className="mt-3 text-sm">Loading chirps…</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-red-400 font-medium">{error}</p>
            <p className="mt-1 text-xs text-mongo-gray">
              Start the backend: cd backend &amp;&amp; npm run dev
            </p>
          </div>
        ) : chirps.length === 0 ? (
          <div className="py-16 text-center text-mongo-gray">
            <p className="text-4xl">🦗</p>
            <p className="mt-3 text-sm">No chirps yet. Be the first to post!</p>
          </div>
        ) : (
          chirps.map((chirp) => (
            <ChirpCard
              key={chirp.id}
              chirp={chirp}
              onDelete={handleDelete}
              isOwn={user?.id === chirp.userId}
            />
          ))
        )}
      </div>
    </section>
  );
}
