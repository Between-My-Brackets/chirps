import Button from '../components/Button';
import InfoCard from '../components/InfoCard';

const features = [
  {
    title: 'RESTful Architecture',
    description:
      'Clean, resource-oriented API design with proper HTTP methods and status codes.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'JWT Authentication',
    description:
      'Secure token-based auth with access and refresh token rotation.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'PostgreSQL + Drizzle',
    description:
      'Type-safe database access with Drizzle ORM and migration support.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
  },
  {
    title: 'OpenAPI Documentation',
    description:
      'Auto-served Swagger UI from an OpenAPI 3.0 specification file.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-mongo-border bg-mongo-panel px-4 py-1.5 text-xs font-medium text-mongo-gray">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-mongo-green" />
          Open-source microblogging API
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-mongo-white sm:text-5xl lg:text-6xl">
          Build social experiences with{' '}
          <span className="text-mongo-green">Chirpy</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-mongo-gray">
          A scalable backend API for a microblogging platform built with
          Node.js, Express, and TypeScript. Clean architecture, JWT
          authentication, and PostgreSQL storage — ready to power your next
          social app.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button to="/api">View API Overview</Button>
          <Button to="/architecture" variant="outline">
            Architecture
          </Button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <InfoCard key={f.title} {...f} />
          ))}
        </div>
      </section>
    </div>
  );
}
