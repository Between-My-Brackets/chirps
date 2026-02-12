import Button from '../components/Button';

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-7xl font-extrabold text-mongo-green">404</p>
      <h1 className="mt-4 text-2xl font-bold text-mongo-white">Page not found</h1>
      <p className="mt-2 text-mongo-gray">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Button to="/">Back to Home</Button>
      </div>
    </section>
  );
}
