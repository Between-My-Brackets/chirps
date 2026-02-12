import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { pathname } = useLocation();
  const { isAuthenticated, user } = useAuth();

  const linkClass = (to: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === to
        ? 'text-mongo-green bg-mongo-green/10'
        : 'text-mongo-gray hover:text-mongo-white hover:bg-mongo-panel'
    }`;

  return (
    <nav className="border-b border-mongo-border bg-mongo-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-mongo-green text-2xl font-extrabold tracking-tight">
            &#123;C&#125;
          </span>
          <span className="text-mongo-white font-bold text-lg">Chirpy</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className={linkClass('/')}>Feed</Link>
          <Link to="/status" className={linkClass('/status')}>Status</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className={linkClass('/profile')}>
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>Login</Link>
              <Link to="/register" className={linkClass('/register')}>
                Register
              </Link>
            </>
          )}

          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="text-mongo-gray hover:text-mongo-white"
            aria-label="Open menu"
            onClick={() => {
              const el = document.getElementById('mobile-menu');
              el?.classList.toggle('hidden');
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className="hidden md:hidden border-t border-mongo-border px-6 pb-4">
        <ul className="flex flex-col gap-1 pt-2">
          <li><Link to="/" className={`block ${linkClass('/')}`}>Feed</Link></li>
          <li><Link to="/status" className={`block ${linkClass('/status')}`}>Status</Link></li>
          {isAuthenticated ? (
            <li><Link to="/profile" className={`block ${linkClass('/profile')}`}>Profile</Link></li>
          ) : (
            <>
              <li><Link to="/login" className={`block ${linkClass('/login')}`}>Login</Link></li>
              <li><Link to="/register" className={`block ${linkClass('/register')}`}>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
