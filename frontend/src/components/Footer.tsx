export default function Footer() {
  return (
    <footer className="border-t border-mongo-border mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-mongo-gray">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-mongo-green font-semibold">Chirpy</span> — Microblogging API
        </p>
        <p className="text-xs text-mongo-gray/60">
          Built with Express · TypeScript · PostgreSQL
        </p>
      </div>
    </footer>
  );
}
