import { Link } from 'react-router-dom';

type BrandLogoProps = {
  className?: string;
  to?: string;
  light?: boolean;
};

export default function BrandLogo({ className = 'h-10', to = '/', light = false }: BrandLogoProps) {
  const src = light ? '/assets/branding/logo-white.png' : '/assets/branding/logo.png';

  const content = (
    <img
      src={src}
      alt="Plutonic Cleaning & Technical Services"
      className={`w-auto object-contain ${className}`}
    />
  );

  if (to) {
    return <Link to={to} className="shrink-0">{content}</Link>;
  }
  return content;
}
