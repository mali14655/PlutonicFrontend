import { Link } from 'react-router-dom';

type BrandLogoProps = {
  className?: string;
  to?: string;
  light?: boolean;
  variant?: 'default' | 'header' | 'footer';
};

export default function BrandLogo({
  className = 'h-10',
  to = '/',
  light = false,
  variant = 'default',
}: BrandLogoProps) {
  const src = light ? '/assets/branding/logo-white.png' : '/assets/branding/logo.png';

  const img = (
    <img
      src={src}
      alt="Plutonic Cleaning & Technical Services"
      className={
        variant === 'header'
          ? `brand-logo-img ${className}`
          : `w-auto object-contain object-left ${className}`
      }
      width={160}
      height={44}
      decoding="async"
    />
  );

  const wrapped =
    variant === 'header' ? (
      <span className="brand-logo-header inline-flex shrink-0 items-center">{img}</span>
    ) : (
      img
    );

  if (to) {
    return (
      <Link to={to} className="shrink-0 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg">
        {wrapped}
      </Link>
    );
  }
  return wrapped;
}
