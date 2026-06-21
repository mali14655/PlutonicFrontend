import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import BookServiceLink from '../components/BookServiceLink';
import { useLocation } from '../context/LocationContext';
import { categoryFallback, getCategoryImageUrl, getServiceImageUrl, images, onImgError, serviceFallback } from '../lib/images';
import AnimateIn, { StaggerGroup } from '../components/AnimateIn';
import StatsCounter from '../components/StatsCounter';
import HowItWorks from '../components/HowItWorks';
import TestimonialsCarousel from '../components/TestimonialsCarousel';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

interface SubService {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  priceAed: number | null;
}

interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

export default function Home() {
  const { location } = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<SubService[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    api<Category[]>('/categories').then(setCategories);
    api<Testimonial[]>('/testimonials').then(setTestimonials);
  }, []);

  useEffect(() => {
    if (!location?.cityId) {
      setFeatured([]);
      return;
    }
    api<{ category: Category; subServices: SubService[] }[]>(
      `/sub-services/with-prices?cityId=${location.cityId}`
    ).then((groups) => {
      const all = groups.flatMap((g) => g.subServices);
      setFeatured(all.slice(0, 6));
    });
  }, [location?.cityId]);

  return (
    <div>
      {/* Hero */}
      <section className="hero-premium min-h-[72vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center">
        <img src={images.hero} alt="" className="hero-bg" />
        <div className="hero-content site-container py-14 sm:py-20 md:py-28 w-full">
          <div className="max-w-2xl hero-stagger">
            <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-plutonic-gold/20 border border-plutonic-gold/40 text-plutonic-gold font-semibold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              UAE Cleaning Experts
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-[1.12] sm:leading-[1.1] tracking-tight">
              Make your world as{' '}
              <span className="text-gradient-gold">clean as mine</span>
            </h1>
            <p className="text-white/75 mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl">
              Premium cleaning, birds control, and pest control across Dubai, Sharjah, and Abu Dhabi.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-10">
              <Link to="/book" className="btn-gold w-full sm:w-auto text-center justify-center">Book a Service</Link>
              <Link to="/services" className="btn-ghost w-full sm:w-auto text-center justify-center">Browse Services</Link>
            </div>
            {location && (
              <p className="mt-8 text-sm text-white/60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
                Live prices for <strong className="text-white">{location.cityName}</strong>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="site-container py-10 sm:py-12 md:py-16">
        <AnimateIn variant="blur-up" className="text-center mb-12">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle mx-auto">Professional solutions tailored for your home and business</p>
        </AnimateIn>
        <StaggerGroup className="grid sm:grid-cols-3 gap-6" stagger={100}>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/services?category=${cat.slug}`}
              className="group premium-card premium-card-3d overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getCategoryImageUrl(cat.slug, cat.imageUrl)}
                  alt={cat.name}
                  className="img-premium w-full h-full"
                  onError={(e) => onImgError(e, categoryFallback(cat.slug, cat.name))}
                />
                <div className="img-overlay-gradient" />
                <h3 className="absolute bottom-4 left-4 right-4 font-bold text-white text-xl">{cat.name}</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 line-clamp-2">{cat.description}</p>
                <span className="mt-3 inline-flex items-center text-sm font-semibold text-plutonic-blue group-hover:gap-2 transition-all">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </StaggerGroup>
      </section>

      {/* Featured */}
      <section className="py-12 md:py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-plutonic-surface via-white to-plutonic-surface" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <AnimateIn variant="fade-up" className="text-center mb-10">
            <h2 className="section-title">Popular Services</h2>
            {!location ? (
              <p className="section-subtitle mx-auto">Select your location to see live prices</p>
            ) : (
              <p className="section-subtitle mx-auto">Prices for {location.cityName}</p>
            )}
          </AnimateIn>
          {featured.length > 0 ? (
            <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={70}>
              {featured.map((s) => (
                <div
                  key={s._id}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/services/${s.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/services/${s.slug}`);
                    }
                  }}
                  className="group premium-card premium-card-3d overflow-hidden cursor-pointer flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={getServiceImageUrl(s.slug, s.imageUrl)}
                      alt={s.name}
                      className="img-premium w-full h-full object-cover"
                      onError={(e) => onImgError(e, serviceFallback(s.slug, s.name))}
                    />
                    <div className="img-overlay-gradient opacity-50" />
                    <span className="absolute top-3 right-3 bg-white/95 text-plutonic-blue-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                      {s.priceAed ? `AED ${s.priceAed}` : '—'}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-base text-plutonic-blue-dark leading-snug group-hover:text-plutonic-blue transition-colors">
                      {s.name}
                    </h3>
                    {s.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed flex-1">
                        {s.description}
                      </p>
                    )}
                    <div
                      className="grid grid-cols-2 gap-2.5 mt-5 pt-4 border-t border-sky-100/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        to={`/services/${s.slug}`}
                        className="btn-outline !py-2.5 !px-3 !text-sm !shadow-none w-full text-center"
                      >
                        Details
                      </Link>
                      <BookServiceLink
                        slug={s.slug}
                        label="Book now"
                        className="!py-2.5 !px-3 !text-sm !shadow-sm hover:!shadow-md !translate-y-0 hover:!translate-y-0 w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </StaggerGroup>
          ) : (
            <p className="text-center text-gray-500">Select a location to view priced services.</p>
          )}
        </div>
      </section>

      <StatsCounter />

      {/* Features */}
      <section className="site-container py-10 sm:py-12 md:py-16">
        <StaggerGroup className="grid md:grid-cols-3 gap-6" stagger={120}>
          {[
            {
              title: 'Highly-Trained Staff',
              desc: 'Skilled, uniformed professionals trained for residential and commercial projects across the UAE.',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
            },
            {
              title: 'Quality Cleaning Tools',
              desc: 'Professional-grade equipment and eco-friendly products for every service we deliver.',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              ),
            },
            {
              title: 'Fast & Effective Service',
              desc: 'On-time completion is our priority — available 24/7 across Dubai, Sharjah, and Abu Dhabi.',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.title} className="premium-card premium-card-3d p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-plutonic-gold text-plutonic-dark flex items-center justify-center mx-auto shadow-lg shadow-plutonic-gold/30">
                {item.icon}
              </div>
              <h3 className="font-bold text-plutonic-blue-dark mt-5 text-lg uppercase tracking-wide">{item.title}</h3>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </StaggerGroup>
      </section>
      {testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 overflow-hidden">
          <AnimateIn variant="fade-up" className="text-center mb-10 md:mb-12">
            <h2 className="section-title">What our clients say</h2>
            <p className="section-subtitle mx-auto mt-2">Trusted by homeowners and businesses across the UAE</p>
          </AnimateIn>
          <TestimonialsCarousel testimonials={testimonials} />
        </section>
      )}

      <HowItWorks />
    </div>
  );
}
