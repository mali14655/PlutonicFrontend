import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

export type RevealVariant = 'fade-up' | 'fade-down' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale' | 'blur-up';

type AnimateInProps = {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
  once?: boolean;
};

export default function AnimateIn({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  as: Component = 'div',
  once = true,
}: AnimateInProps) {
  const [ref, inView] = useInView<HTMLElement>({ once });

  const style: CSSProperties = {
    '--reveal-delay': `${delay}ms`,
    '--reveal-duration': `${duration}ms`,
  } as CSSProperties;

  return (
    <Component
      ref={ref}
      className={`reveal reveal-${variant} ${inView ? 'reveal-visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </Component>
  );
}

/** Wraps children; each direct child staggers in when the group enters view. */
export function StaggerGroup({
  children,
  className = '',
  stagger = 80,
  variant = 'fade-up',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  variant?: RevealVariant;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ once: true });

  const style: CSSProperties = {
    '--stagger-step': `${stagger}ms`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`stagger-group reveal-${variant} ${inView ? 'stagger-visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
