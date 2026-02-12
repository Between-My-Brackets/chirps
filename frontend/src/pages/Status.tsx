import { useEffect, useState } from 'react';

interface StatusItem {
  label: string;
  value: string;
  ok: boolean;
  detail: string;
  loading?: boolean;
}

export default function Status() {
  const [serverStatus, setServerStatus] = useState<StatusItem>({
    label: 'Server Status',
    value: 'Checking…',
    ok: false,
    detail: 'Pinging /api/healthz',
    loading: true,
  });

  const [latency, setLatency] = useState<StatusItem>({
    label: 'API Latency',
    value: 'Measuring…',
    ok: false,
    detail: 'Round-trip to /api/healthz',
    loading: true,
  });

  useEffect(() => {
    const check = async () => {
      const start = performance.now();
      try {
        const res = await fetch('/api/healthz');
        const elapsed = Math.round(performance.now() - start);

        if (res.ok) {
          setServerStatus({
            label: 'Server Status',
            value: 'Online',
            ok: true,
            detail: `Express server responded with ${res.status}`,
          });
          setLatency({
            label: 'API Latency',
            value: `${elapsed} ms`,
            ok: elapsed < 500,
            detail: 'Round-trip to /api/healthz',
          });
        } else {
          setServerStatus({
            label: 'Server Status',
            value: 'Error',
            ok: false,
            detail: `Server returned ${res.status}`,
          });
          setLatency({
            label: 'API Latency',
            value: `${elapsed} ms`,
            ok: false,
            detail: 'Response was not OK',
          });
        }
      } catch {
        setServerStatus({
          label: 'Server Status',
          value: 'Offline',
          ok: false,
          detail: 'Could not reach the backend — is it running?',
        });
        setLatency({
          label: 'API Latency',
          value: '—',
          ok: false,
          detail: 'Unable to measure',
        });
      }
    };

    check();
    const interval = setInterval(check, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, []);

  const staticItems: StatusItem[] = [
    {
      label: 'Database',
      value: 'PostgreSQL',
      ok: true,
      detail: 'Drizzle ORM · localhost:5432',
    },
    {
      label: 'Uptime Target',
      value: '99.9 %',
      ok: true,
      detail: 'SLA target (placeholder)',
    },
  ];

  const allItems = [serverStatus, latency, ...staticItems];
  const allOk = serverStatus.ok;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-mongo-white sm:text-4xl">
        Status
      </h1>
      <p className="mt-3 text-mongo-gray">
        Live service health for the Chirpy API.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {allItems.map((item) => (
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
                  item.loading
                    ? 'bg-amber-500/10 text-amber-400'
                    : item.ok
                      ? 'bg-mongo-green/10 text-mongo-green'
                      : 'bg-red-500/10 text-red-400'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    item.loading
                      ? 'bg-amber-400 animate-pulse'
                      : item.ok
                        ? 'bg-mongo-green'
                        : 'bg-red-400'
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
      <div
        className={`mt-8 rounded-xl border p-6 text-center ${
          allOk
            ? 'border-mongo-green/20 bg-mongo-green/5'
            : serverStatus.loading
              ? 'border-amber-500/20 bg-amber-500/5'
              : 'border-red-500/20 bg-red-500/5'
        }`}
      >
        <p
          className={`font-semibold ${
            allOk
              ? 'text-mongo-green'
              : serverStatus.loading
                ? 'text-amber-400'
                : 'text-red-400'
          }`}
        >
          {allOk
            ? 'All Systems Operational'
            : serverStatus.loading
              ? 'Checking Systems…'
              : 'Backend Unreachable'}
        </p>
        <p className="mt-1 text-sm text-mongo-gray">
          {allOk
            ? 'The backend API is responding normally.'
            : serverStatus.loading
              ? 'Pinging the backend health endpoint…'
              : 'Start the backend with: cd backend && npm run dev'}
        </p>
      </div>
    </section>
  );
}
