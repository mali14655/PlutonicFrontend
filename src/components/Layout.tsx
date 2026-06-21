import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from './PageTransition';
import LocationPicker from './LocationPicker';
import BrandLogo from './BrandLogo';
import {
  ContactInfoRow,
  IconCalendar,
  IconClock,
  IconGlobe,
  IconMail,
  IconMapPin,
  IconMessage,
  IconPhone,
  IconServices,
} from './ContactIcons';
import { OFFICE_LOCATION, buildDirectionsUrl } from '../lib/officeLocation';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/company-profile', label: 'Company' },
  { to: '/leadership', label: 'Leadership' },
  { to: '/contact', label: 'Contact' },
];

const quickLinks = [
  { to: '/company-profile', label: 'Company Profile', icon: IconServices },
  { to: '/leadership', label: 'Leadership', icon: IconMessage },
  { to: '/services', label: 'Services', icon: IconServices },
  { to: '/book', label: 'Book Online', icon: IconCalendar },
  { to: '/contact', label: 'Contact Us', icon: IconMessage },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const directionsUrl = buildDirectionsUrl();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="header-premium">
        <div className="site-container">
          <div className="flex items-center justify-between gap-2 sm:gap-3 py-2.5 sm:py-3 min-h-[3.25rem] sm:min-h-[3.75rem]">
            <BrandLogo to="/" variant="header" className="h-8 sm:h-9 md:h-10" />

            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-1 justify-center px-4">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="nav-link-premium">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <LocationPicker compact />
              <Link
                to="/book"
                className="btn-primary !py-2 !px-3 sm:!px-4 !text-xs sm:!text-sm hidden sm:inline-flex whitespace-nowrap"
              >
                Book Now
              </Link>
              <button
                type="button"
                className="lg:hidden p-2 rounded-xl text-plutonic-blue-dark hover:bg-sky-100 active:bg-sky-200/80 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-sky-100 bg-white/98 backdrop-blur-xl site-container py-3 space-y-1 animate-[slide-down_0.2s_ease-out]">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-plutonic-blue-dark hover:bg-sky-50 font-medium text-base"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/book" onClick={() => setMenuOpen(false)} className="btn-gold w-full mt-2 !py-3">
              Book Now
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 min-w-0 pt-[var(--header-height)]">
        <PageTransition />
      </main>

      <footer className="footer-premium">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.25), transparent 50%)' }}
        />
        <div className="site-container py-10 sm:py-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 text-sm relative z-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo to="/" light className="h-9 sm:h-10 mb-4 sm:mb-5" />
            <ContactInfoRow variant="footer" icon={<IconMapPin className="w-4 h-4 shrink-0" />} href={directionsUrl}>
              <p className="text-white/90 text-sm leading-relaxed group-hover:text-white">
                {OFFICE_LOCATION.address}
              </p>
            </ContactInfoRow>
          </div>

          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-plutonic-gold uppercase tracking-wider text-xs">Contact</h4>
            <div className="space-y-3">
              <ContactInfoRow variant="footer" icon={<IconPhone className="w-4 h-4 shrink-0" />} href="tel:+971561615616">
                <p className="text-white/90">+971 56 1615616</p>
                <p className="text-white/75 text-xs mt-0.5">+971 55 3914339</p>
              </ContactInfoRow>
              <ContactInfoRow
                variant="footer"
                icon={<IconMail className="w-4 h-4 shrink-0" />}
                href="mailto:info@plutoniccleaningandtech.com"
              >
                <p className="text-white/90 break-all">info@plutoniccleaningandtech.com</p>
              </ContactInfoRow>
              <ContactInfoRow
                variant="footer"
                icon={<IconGlobe className="w-4 h-4 shrink-0" />}
                href="https://plutoniccleaningandtech.com"
              >
                <p className="text-white/90">plutoniccleaningandtech.com</p>
              </ContactInfoRow>
              <ContactInfoRow variant="footer" icon={<IconClock className="w-4 h-4 shrink-0" />}>
                <p className="text-plutonic-gold font-semibold">24/7 Service</p>
              </ContactInfoRow>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold mb-3 sm:mb-4 text-plutonic-gold uppercase tracking-wider text-xs">Quick Links</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-0.5">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 py-2 text-white/90 hover:text-plutonic-gold transition group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-plutonic-gold group-hover:bg-white/20 transition shrink-0">
                      <Icon />
                    </span>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 text-center text-xs text-white/60 py-4 sm:py-5 px-4 relative z-10">
          © {new Date().getFullYear()} Plutonic Cleaning & Technical Services L.L.C
        </div>
      </footer>

      <a
        href="https://wa.me/971561615616"
        target="_blank"
        rel="noreferrer"
        className="wa-fab"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.529 5.886L0 24l6.335-1.498A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-4.988-1.353l-.358-.214-3.76.89.998-3.648-.233-.375A9.818 9.818 0 1112 21.818z" />
        </svg>
        <span className="wa-fab-label">WhatsApp</span>
      </a>
    </div>
  );
}
