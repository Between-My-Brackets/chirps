import RouteCard from '../components/RouteCard';

interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  auth?: string;
}

const routes: Route[] = [
  { method: 'GET', path: '/api/healthz', description: 'Checks the health of the API.' },
  { method: 'POST', path: '/api/users', description: 'Creates a new user.' },
  { method: 'PUT', path: '/api/users', description: "Updates the authenticated user's info.", auth: 'JWT' },
  { method: 'POST', path: '/api/login', description: 'Logs in a user and returns JWTs.' },
  { method: 'POST', path: '/api/refresh', description: 'Issues a new access token using a refresh token.', auth: 'JWT' },
  { method: 'POST', path: '/api/revoke', description: 'Revokes a refresh token.', auth: 'JWT' },
  { method: 'GET', path: '/api/chirps', description: 'Gets a list of all chirps.' },
  { method: 'POST', path: '/api/chirps', description: 'Creates a new chirp.', auth: 'JWT' },
  { method: 'GET', path: '/api/chirps/{chirpId}', description: 'Gets a single chirp by its ID.' },
  { method: 'DELETE', path: '/api/chirps/{chirpId}', description: 'Deletes a chirp.', auth: 'JWT' },
  { method: 'POST', path: '/api/polka/webhooks', description: 'Handles webhooks from the Polka service.', auth: 'API Key' },
  { method: 'GET', path: '/admin/metrics', description: 'Displays admin page with usage metrics.' },
  { method: 'POST', path: '/admin/reset', description: 'Resets the database (dev mode only).' },
];

export default function ApiOverview() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-mongo-white sm:text-4xl">
        API Overview
      </h1>
      <p className="mt-3 text-mongo-gray">
        All available endpoints for the Chirpy backend. Routes marked with a
        badge require authentication.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {routes.map((route) => (
          <RouteCard key={`${route.method}-${route.path}`} {...route} />
        ))}
      </div>
    </section>
  );
}
