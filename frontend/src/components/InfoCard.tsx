interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function InfoCard({ title, description, icon, className = '' }: InfoCardProps) {
  return (
    <div
      className={`rounded-xl border border-mongo-border bg-mongo-panel p-6 transition-colors hover:border-mongo-green/30 ${className}`}
    >
      {icon && (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-mongo-green/10 text-mongo-green">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-base font-semibold text-mongo-white">{title}</h3>
      <p className="text-sm leading-relaxed text-mongo-gray">{description}</p>
    </div>
  );
}
