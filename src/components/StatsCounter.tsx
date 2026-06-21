import { useEffect, useState, type ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

type Stat = {
  icon: ReactNode;
  value: number;
  suffix?: string;
  label: string;
};

function AnimatedNumber({ value, suffix = '', active }: { value: number; suffix?: string; active: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, value]);

  return (
    <span>
      {active ? display.toLocaleString() : '0'}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  const [ref, inView] = useInView<HTMLElement>({ once: true });

  const stats: Stat[] = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      value: 15000,
      suffix: '+',
      label: 'Satisfied Customers',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
        </svg>
      ),
      value: 3500,
      suffix: '+',
      label: 'Projects Completed',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
      value: 200,
      suffix: '+',
      label: 'Trained Professionals',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      value: 7,
      label: 'Emirates Served',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-14 md:py-16 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 45%, #38bdf8 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, white 0%, transparent 8%), radial-gradient(circle at 80% 70%, white 0%, transparent 6%), radial-gradient(circle at 50% 50%, white 0%, transparent 4%)',
          backgroundSize: '120px 120px, 80px 80px, 60px 60px',
        }}
      />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <p className="text-3xl md:text-4xl font-extrabold tracking-tight">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} active={inView} />
              </p>
              <div className="mt-2 h-0.5 w-12 mx-auto bg-plutonic-gold/80 rounded-full" />
              <p className="mt-3 text-xs md:text-sm font-semibold uppercase tracking-wider text-white/90">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
