import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/api', label: 'API Overview' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/status', label: 'Status' },
];

export default function Navbar() {
  const { pathname } = useLocation();

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

        {/* Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === to
                    ? 'text-mongo-green bg-mongo-green/10'
                    : 'text-mongo-gray hover:text-mongo-white hover:bg-mongo-panel'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger — basic toggle */}
        <button
          className="md:hidden text-mongo-gray hover:text-mongo-white"
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

      {/* Mobile menu */}
      <div id="mobile-menu" className="hidden md:hidden border-t border-mongo-border px-6 pb-4">
        <ul className="flex flex-col gap-1 pt-2">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === to
                    ? 'text-mongo-green bg-mongo-green/10'
                    : 'text-mongo-gray hover:text-mongo-white hover:bg-mongo-panel'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
