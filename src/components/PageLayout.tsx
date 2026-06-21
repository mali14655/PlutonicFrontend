import type { ReactNode } from 'react';
import AnimateIn from './AnimateIn';

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  gradient = 'from-plutonic-dark/92 via-sky-900/88 to-sky-700/80',
  size = 'default',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  gradient?: string;
  size?: 'default' | 'compact';
}) {
  const compact = size === 'compact';

  return (
    <section
      className={`relative overflow-hidden flex items-center ${
        compact ? 'py-8 md:py-10 min-h-[140px] md:min-h-[160px]' : 'py-16 md:py-20 min-h-[320px] md:min-h-[380px]'
      }`}
    >
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.4),transparent_50%)]"
        aria-hidden
      />
      <div className={`relative z-10 max-w-4xl mx-auto px-4 text-center text-white ${compact ? 'py-2' : 'py-8'}`}>
        <AnimateIn variant="blur-up">
          {eyebrow && (
            <p
              className={`text-plutonic-gold font-bold uppercase tracking-[0.2em] ${
                compact ? 'text-[10px] mb-2' : 'text-xs mb-4'
              }`}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className={`font-extrabold tracking-tight leading-tight ${
              compact ? 'text-xl md:text-2xl' : 'text-3xl md:text-5xl'
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-white/85 max-w-2xl mx-auto leading-relaxed ${
                compact ? 'mt-2 text-sm' : 'mt-5 text-lg'
              }`}
            >
              {subtitle}
            </p>
          )}
        </AnimateIn>
      </div>
    </section>
  );
}

export function PageContent({
  children,
  className = '',
  narrow = false,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div className={`site-container py-10 sm:py-14 md:py-20 ${narrow ? 'max-w-4xl' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function PageShell({
  children,
  className = '',
  narrow = false,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div className={`site-container py-10 sm:py-14 md:py-20 ${narrow ? 'max-w-lg' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  className = '',
  children,
  animate = true,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
  animate?: boolean;
}) {
  const content = (
    <>
      <h1 className="section-title">{title}</h1>
      {subtitle && <p className="section-subtitle mt-2">{subtitle}</p>}
      {children}
    </>
  );

  if (!animate) {
    return <div className={`mb-10 ${className}`}>{content}</div>;
  }

  return (
    <AnimateIn variant="blur-up" className={`mb-10 ${className}`}>
      {content}
    </AnimateIn>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
  className = '',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <AnimateIn variant="fade-up" className={`mb-10 ${center ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-plutonic-blue">{eyebrow}</p>
      )}
      <h2 className={`section-title ${eyebrow ? 'mt-3' : ''}`}>{title}</h2>
      {subtitle && (
        <p className={`section-subtitle mt-2 ${center ? 'mx-auto' : ''}`}>{subtitle}</p>
      )}
    </AnimateIn>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <PageContent>
      <div className="premium-card-glow p-12 text-center text-gray-600">{children}</div>
    </PageContent>
  );
}

export function GlowImage({
  src,
  alt,
  className = 'aspect-[4/3]',
  onError,
}: {
  src: string;
  alt: string;
  className?: string;
  onError?: (e: { currentTarget: HTMLImageElement }) => void;
}) {
  return (
    <div className="relative">
      <div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-200/50 to-sky-100/20 blur-2xl"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(3,105,161,0.15)] ring-1 ring-sky-200/60">
        <img src={src} alt={alt} className={`w-full object-cover ${className}`} onError={onError} />
      </div>
    </div>
  );
}
