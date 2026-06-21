import { OFFICE_LOCATION } from './officeLocation';
import { images } from './images';

export const companyHero = {
  eyebrow: 'Company Profile',
  title: 'Plutonic Cleaning & Technical Services L.L.C',
  subtitle:
    'A Dubai-based company delivering professional cleaning, maintenance, and technical services to homes and businesses across the United Arab Emirates.',
};

export const companyOverview = {
  heading: 'Who we are',
  paragraphs: [
    'Plutonic Cleaning and Technical Services L.L.C. is headquartered at Marina Plaza in Dubai Marina. We specialise in cleaning, painting, plumbing, electrical work, carpentry, tiling, and air-conditioner repair for residential and commercial clients.',
    'Built on client confidence and growing demand, we have expanded our operations across all seven Emirates. Our trained teams work with modern equipment and clear processes so every job is completed on time, at fair prices, and to a professional standard.',
    'From deep cleaning in Dubai Marina apartments to office maintenance in JLT and Sharjah, Plutonic is focused on one priority: making life easier for our clients through reliable, transparent, and high-quality service.',
  ],
  quote:
    'Have the peace of mind that only comes from knowing the job was done right — with the right materials and true professionals.',
};

export const companyFacts = [
  { label: 'Registered entity', value: 'Plutonic Cleaning & Technical Services L.L.C' },
  { label: 'Head office', value: OFFICE_LOCATION.address },
  { label: 'Coverage', value: 'All 7 Emirates across the UAE' },
  { label: 'Client focus', value: 'Residential & commercial properties' },
];

export const coreValues = [
  {
    title: 'On-time delivery',
    description: 'Every booking is scheduled and completed with punctuality — we respect your time and deadlines.',
    icon: 'clock',
  },
  {
    title: 'Fair, transparent pricing',
    description: 'Clear quotes with no hidden costs. Quality service at competitive rates across Dubai and the UAE.',
    icon: 'pricing',
  },
  {
    title: 'Trained professionals',
    description: 'Skilled, uniformed teams trained in safe methods, customer care, and service-specific standards.',
    icon: 'team',
  },
  {
    title: 'Modern equipment',
    description: 'Industry-grade tools and technology for cleaning, maintenance, and technical work at every scale.',
    icon: 'equipment',
  },
];

export const services = [
  {
    name: 'Cleaning services',
    description: 'Deep cleaning, regular maintenance, sofa and carpet care, and commercial cleaning.',
  },
  {
    name: 'Painting services',
    description: 'Interior and exterior painting for homes, offices, and commercial properties.',
  },
  {
    name: 'Plumbing services',
    description: 'Repairs, installations, and maintenance for residential and commercial plumbing.',
  },
  {
    name: 'Electrical work',
    description: 'Safe electrical repairs, fittings, and maintenance by qualified technicians.',
  },
  {
    name: 'Carpentry & tiling',
    description: 'Custom carpentry, tiling, and finishing work for interiors and exteriors.',
  },
  {
    name: 'Air-conditioner repair',
    description: 'AC servicing, repair, and maintenance to keep your spaces cool and efficient.',
  },
];

export const statsSection = {
  eyebrow: 'Our track record',
  title: 'Projects, clients, and coverage',
  subtitle:
    'Numbers that reflect the trust our clients place in Plutonic — and the scale of service we deliver every day across the UAE.',
};

export const companyImage = images.office;
