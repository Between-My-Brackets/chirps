import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  variant?: 'primary' | 'outline';
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  to,
  variant = 'primary',
  className = '',
  onClick,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer';

  const variants = {
    primary: 'bg-mongo-green text-mongo-black hover:bg-mongo-green/85',
    outline:
      'border border-mongo-border text-mongo-gray hover:text-mongo-white hover:border-mongo-gray',
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
