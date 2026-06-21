import { useState } from 'react';
import { api } from '../api';
import AnimateIn from '../components/AnimateIn';
import BusinessProfilePanel from '../components/BusinessProfilePanel';
import { PageContent, PageHeader } from '../components/PageLayout';
import {
  ContactInfoRow,
  IconClock,
  IconGlobe,
  IconMail,
  IconMapPin,
  IconPhone,
} from '../components/ContactIcons';
import { OFFICE_LOCATION, buildDirectionsUrl } from '../lib/officeLocation';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api('/bookings/contact', { method: 'POST', body: JSON.stringify(form) });
    setSent(true);
  };

  return (
    <PageContent>
      <PageHeader
        title="Contact Us"
        subtitle="Visit our office, call us, or send a message — we're here 24/7"
      />
        <AnimateIn variant="fade-up" delay={80}>
          <BusinessProfilePanel />
        </AnimateIn>

        <div className="grid lg:grid-cols-2 gap-10 items-start mt-10">
          <AnimateIn variant="slide-right" delay={120}>
            <div className="premium-card-glow p-6 space-y-1">
              <h2 className="font-bold text-lg text-plutonic-blue-dark mb-4 pb-3 border-b border-sky-100">
                Contact info
              </h2>
              <ContactInfoRow icon={<IconMapPin />} href={buildDirectionsUrl()}>
                <p className="font-semibold text-plutonic-blue-dark text-sm">Office</p>
                <p className="text-gray-600 text-sm mt-0.5">{OFFICE_LOCATION.address}</p>
              </ContactInfoRow>
              <div className="py-3 border-b border-dashed border-sky-100" />
              <ContactInfoRow icon={<IconPhone />} href="tel:+971561615616">
                <p className="font-semibold text-plutonic-blue-dark text-sm">Phone</p>
                <p className="text-gray-600 text-sm mt-0.5">+971 56 1615616</p>
                <p className="text-gray-500 text-sm">+971 55 3914339</p>
              </ContactInfoRow>
              <div className="py-3 border-b border-dashed border-sky-100" />
              <ContactInfoRow icon={<IconMail />} href="mailto:info@plutoniccleaningandtech.com">
                <p className="font-semibold text-plutonic-blue-dark text-sm">Email</p>
                <p className="text-gray-600 text-sm mt-0.5">info@plutoniccleaningandtech.com</p>
              </ContactInfoRow>
              <div className="py-3 border-b border-dashed border-sky-100" />
              <ContactInfoRow icon={<IconGlobe />} href="https://plutoniccleaningandtech.com">
                <p className="font-semibold text-plutonic-blue-dark text-sm">Website</p>
                <p className="text-gray-600 text-sm mt-0.5">plutoniccleaningandtech.com</p>
              </ContactInfoRow>
              <div className="py-3 border-b border-dashed border-sky-100" />
              <ContactInfoRow icon={<IconClock />}>
                <p className="font-semibold text-plutonic-gold text-sm">24/7 emergency service</p>
              </ContactInfoRow>
            </div>
          </AnimateIn>

          <AnimateIn variant="slide-left" delay={160} className="premium-card-glow p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <p className="mt-4 text-green-700 font-semibold text-lg">Thank you!</p>
                <p className="text-gray-500 text-sm mt-1">We will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h2 className="font-bold text-xl text-plutonic-blue-dark mb-2">Send a message</h2>
                <input
                  className="input-premium"
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="input-premium"
                  placeholder="Email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  className="input-premium"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <textarea
                  className="input-premium"
                  rows={4}
                  placeholder="Message"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button type="submit" className="btn-primary w-full">Send Message</button>
              </form>
            )}
          </AnimateIn>
        </div>
    </PageContent>
  );
}
