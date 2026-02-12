interface RouteCardProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  auth?: string;
}

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  PATCH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function RouteCard({ method, path, description, auth }: RouteCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-mongo-border bg-mongo-panel p-4 transition-colors hover:border-mongo-green/30">
      {/* Method badge */}
      <span
        className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${methodColors[method]}`}
      >
        {method}
      </span>

      {/* Route info */}
      <div className="flex-1 min-w-0">
        <code className="text-sm font-medium text-mongo-white">{path}</code>
        <p className="mt-1 text-sm text-mongo-gray">{description}</p>
      </div>

      {/* Auth label */}
      {auth && (
        <span className="shrink-0 rounded-full bg-mongo-green/10 px-2.5 py-1 text-xs font-medium text-mongo-green">
          {auth}
        </span>
      )}
    </div>
  );
}
