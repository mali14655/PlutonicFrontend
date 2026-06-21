import { Link } from 'react-router-dom';
import AnimateIn, { StaggerGroup } from '../components/AnimateIn';
import { GlowImage, PageContent, PageHero, SectionHeader } from '../components/PageLayout';
import StatsCounter from '../components/StatsCounter';
import {
  companyFacts,
  companyHero,
  companyImage,
  companyOverview,
  coreValues,
  services,
  statsSection,
} from '../lib/companyContent';
import { images, onImgError } from '../lib/images';

function ValueIcon({ type }: { type: string }) {
  const cls = 'w-6 h-6';
  switch (type) {
    case 'clock':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'pricing':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'team':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
  }
}

export default function CompanyProfile() {
  return (
    <div>
      <PageHero
        eyebrow={companyHero.eyebrow}
        title={companyHero.title}
        subtitle={companyHero.subtitle}
        image={companyImage}
      />

      <PageContent>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 md:mb-20">
          <AnimateIn variant="fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-plutonic-blue">About us</p>
            <h2 className="section-title mt-3">{companyOverview.heading}</h2>
            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
              {companyOverview.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <blockquote className="mt-8 border-l-4 border-plutonic-gold pl-5 py-1">
              <p className="font-semibold text-plutonic-blue-dark text-lg leading-relaxed">{companyOverview.quote}</p>
            </blockquote>
          </AnimateIn>

          <AnimateIn variant="fade-up" delay={80}>
            <GlowImage
              src={companyImage}
              alt="Plutonic office"
              onError={(e) => onImgError(e, images.office)}
            />
          </AnimateIn>
        </div>

        <AnimateIn variant="fade-up" className="mb-16 md:mb-20">
          <div className="premium-card-glow p-6 md:p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-plutonic-blue mb-6">
              Company information
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {companyFacts.map((fact) => (
                <div key={fact.label} className="border border-sky-100 rounded-xl p-4 bg-sky-50/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{fact.label}</p>
                  <p className="mt-1 text-sm font-semibold text-plutonic-blue-dark leading-snug">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>

        <section className="mb-16 md:mb-20">
          <SectionHeader
            center
            eyebrow="What drives us"
            title="Our core values"
            subtitle="The principles behind every Plutonic service — from the first call to the final sign-off."
          />
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" stagger={80}>
            {coreValues.map((v) => (
              <div key={v.title} className="premium-card-glow p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-plutonic-blue flex items-center justify-center mb-4">
                  <ValueIcon type={v.icon} />
                </div>
                <h3 className="font-bold text-plutonic-blue-dark">{v.title}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </StaggerGroup>
        </section>

        <section className="mb-4">
          <SectionHeader
            eyebrow="Services"
            title="What we offer"
            subtitle="Comprehensive cleaning and technical services for homes, offices, and commercial properties throughout the UAE."
          />
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" stagger={70}>
            {services.map((s) => (
              <div
                key={s.name}
                className="premium-card-glow p-5 flex gap-4 items-start group hover:border-sky-200 transition-colors"
              >
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-200/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-bold text-plutonic-blue-dark">{s.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </StaggerGroup>
        </section>
      </PageContent>

      <div className="max-w-6xl mx-auto px-4 pt-4 pb-4">
        <SectionHeader
          center
          eyebrow={statsSection.eyebrow}
          title={statsSection.title}
          subtitle={statsSection.subtitle}
          className="!mb-6"
        />
      </div>
      <StatsCounter />

      <PageContent className="!pt-10">
        <AnimateIn
          variant="fade-up"
          className="premium-card-glow p-8 md:p-10 text-center mesh-sky-bg border border-sky-100"
        >
          <h2 className="text-2xl font-extrabold text-plutonic-blue-dark">Ready to book with Plutonic?</h2>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto leading-relaxed">
            Schedule cleaning or technical services online — transparent pricing, trained teams, and professional
            results across Dubai, Sharjah, Abu Dhabi, and the wider UAE.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link to="/book" className="btn-primary">Book a service</Link>
            <Link to="/leadership" className="btn-outline">Meet our leadership</Link>
            <Link to="/contact" className="btn-outline">Contact us</Link>
          </div>
        </AnimateIn>
      </PageContent>
    </div>
  );
}
