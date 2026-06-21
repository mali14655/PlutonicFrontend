import { Link } from 'react-router-dom';

export default function BookServiceLink({
  slug,
  className = '',
  variant = 'primary',
  label = 'Book this service',
  fullWidth = false,
}: {
  slug: string;
  className?: string;
  variant?: 'primary' | 'outline' | 'gold';
  label?: string;
  fullWidth?: boolean;
}) {
  const base =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'gold'
        ? 'btn-gold'
        : 'btn-outline';

  return (
    <Link
      to="/book"
      state={{ subServiceSlug: slug }}
      onClick={(e) => e.stopPropagation()}
      className={`${base} ${fullWidth ? 'w-full text-center' : ''} ${className}`}
    >
      {label}
    </Link>
  );
}
