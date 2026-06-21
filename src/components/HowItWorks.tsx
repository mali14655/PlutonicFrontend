import { Link } from 'react-router-dom';
import AnimateIn, { StaggerGroup } from './AnimateIn';

const steps = [
  {
    title: 'Select location',
    desc: 'Choose your emirate and area so we show accurate prices for your neighbourhood.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Choose service',
    desc: 'Browse cleaning, pest control, birds control, and more — add multiple services in one booking.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Pick date & time',
    desc: 'See real availability and pick a slot that fits your schedule — we confirm instantly.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Confirm & pay',
    desc: 'Pay online by card, bank transfer, or cash on arrival — your booking reference is sent immediately.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-sky-50/40 to-plutonic-surface pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <AnimateIn variant="fade-up" className="text-center mb-14">
          <p className="text-plutonic-blue font-bold text-xs uppercase tracking-widest mb-2">Simple process</p>
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle mx-auto mt-3 max-w-xl">
            Book professional cleaning and technical services in four easy steps — takes less than two minutes.
          </p>
        </AnimateIn>

        <div className="hidden lg:block absolute top-[52%] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 -translate-y-1/2 z-0" />

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 relative z-10" stagger={100}>
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="premium-card-glow p-6 text-center group hover:border-sky-300/80 transition-all duration-300"
            >
              <div className="relative mx-auto mb-5 w-fit">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 sm:right-auto sm:-left-2 w-7 h-7 rounded-full bg-plutonic-gold text-plutonic-dark text-xs font-extrabold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-plutonic-blue-dark text-base">{step.title}</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </StaggerGroup>

        <AnimateIn variant="scale" delay={200} className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/book" className="btn-primary !px-8">Start Booking</Link>
          <Link to="/services" className="btn-outline">View all services</Link>
        </AnimateIn>
      </div>
    </section>
  );
}
