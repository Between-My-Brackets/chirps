const statusItems = [
  {
    label: 'Server Status',
    value: 'Online',
    ok: true,
    detail: 'Express server running on port 8080',
  },
  {
    label: 'Database Connection',
    value: 'Connected',
    ok: true,
    detail: 'PostgreSQL via Drizzle ORM',
  },
  {
    label: 'Uptime',
    value: '99.9 %',
    ok: true,
    detail: 'Last 30 days (placeholder)',
  },
  {
    label: 'API Latency',
    value: '~12 ms',
    ok: true,
    detail: 'Average response time (placeholder)',
  },
];

export default function Status() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-mongo-white sm:text-4xl">
        Status
      </h1>
      <p className="mt-3 text-mongo-gray">
        Service health overview for the Chirpy API.{' '}
        <span className="text-mongo-gray/60 text-sm">(static placeholder)</span>
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {statusItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-mongo-border bg-mongo-panel p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-mongo-gray">
                {item.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  item.ok
                    ? 'bg-mongo-green/10 text-mongo-green'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    item.ok ? 'bg-mongo-green' : 'bg-red-400'
                  }`}
                />
                {item.value}
              </span>
            </div>
            <p className="mt-3 text-sm text-mongo-gray/70">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Overall banner */}
      <div className="mt-8 rounded-xl border border-mongo-green/20 bg-mongo-green/5 p-6 text-center">
        <p className="text-mongo-green font-semibold">All Systems Operational</p>
        <p className="mt-1 text-sm text-mongo-gray">
          No incidents reported. This is a static placeholder — live monitoring coming soon.
        </p>
      </div>
    </section>
  );
}
