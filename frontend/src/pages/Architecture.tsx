const layers = [
  {
    name: 'Client Request',
    description: 'HTTP request enters the Express server on port 8080.',
    icon: '→',
  },
  {
    name: 'Authentication',
    description:
      'JWT tokens are validated via middleware. Refresh tokens support rotation.',
    icon: '🔐',
  },
  {
    name: 'Middleware',
    description:
      'Logging, metrics tracking, and JSON body parsing run before every route handler.',
    icon: '⚙️',
  },
  {
    name: 'Router',
    description:
      'Express Router maps the HTTP method + path to the correct controller.',
    icon: '🔀',
  },
  {
    name: 'Controller',
    description:
      'Business logic executes — validates input, calls database queries, builds the response.',
    icon: '📋',
  },
  {
    name: 'Database (Drizzle + PostgreSQL)',
    description:
      'Type-safe queries via Drizzle ORM interact with PostgreSQL. Migrations managed by drizzle-kit.',
    icon: '🗄️',
  },
  {
    name: 'Response',
    description:
      'Standardized JSON response sent back to the client with proper status codes.',
    icon: '←',
  },
];

export default function Architecture() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-mongo-white sm:text-4xl">
        Architecture
      </h1>
      <p className="mt-3 text-mongo-gray">
        How a request flows through the Chirpy backend, from ingress to response.
      </p>

      {/* Timeline */}
      <div className="relative mt-12 ml-4">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-mongo-border" />

        <div className="flex flex-col gap-8">
          {layers.map((layer, i) => (
            <div key={layer.name} className="relative flex items-start gap-6 pl-8">
              {/* Dot */}
              <div
                className={`absolute left-0 top-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm ${
                  i === 0 || i === layers.length - 1
                    ? 'border-mongo-green bg-mongo-green/15 text-mongo-green'
                    : 'border-mongo-border bg-mongo-panel text-mongo-gray'
                }`}
              >
                {layer.icon}
              </div>

              {/* Content card */}
              <div className="rounded-xl border border-mongo-border bg-mongo-panel p-5 flex-1">
                <h3 className="text-base font-semibold text-mongo-white">
                  {layer.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-mongo-gray">
                  {layer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
