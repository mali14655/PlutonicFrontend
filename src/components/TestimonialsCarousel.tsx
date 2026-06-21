import { useRef, useState, useEffect, type ReactNode } from 'react';

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, n) => (
        <svg
          key={n}
          className={`w-4 h-4 ${n < rating ? 'text-amber-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="premium-card-glow p-6 md:p-8 h-full flex flex-col">
      <StarRow rating={t.rating} />
      <p className="text-gray-700 leading-relaxed text-sm md:text-base flex-1">{t.text}</p>
      <div className="mt-5 flex items-center gap-3 pt-5 border-t border-sky-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
          {t.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-plutonic-blue-dark text-sm">{t.name}</p>
          <p className="text-xs text-gray-500">Verified client</p>
        </div>
      </div>
    </div>
  );
}

function NavBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-10 h-10 rounded-full border border-sky-200 bg-white text-plutonic-blue-dark shadow-md flex items-center justify-center hover:bg-sky-50 hover:border-sky-300 transition disabled:opacity-30 disabled:pointer-events-none"
      aria-hidden
    >
      {children}
    </button>
  );
}

export default function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [testimonials.length]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-carousel-card]');
    const gap = 16;
    const step = (card?.offsetWidth ?? 320) + gap;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="hidden md:flex absolute -top-14 right-0 gap-2">
        <NavBtn onClick={() => scrollByCard(-1)} disabled={!canPrev}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </NavBtn>
        <NavBtn onClick={() => scrollByCard(1)} disabled={!canNext}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </NavBtn>
      </div>

      <div
        ref={trackRef}
        className="testimonials-carousel flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 md:mx-0 md:px-0 cursor-grab active:cursor-grabbing"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            data-carousel-card
            className="snap-start shrink-0 w-[88vw] sm:w-[min(420px,48vw)] lg:w-[calc((100%-2rem)/2)]"
          >
            <TestimonialCard t={t} />
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4 md:hidden">Swipe to read more reviews →</p>
    </div>
  );
}
