import { images } from './images';

export interface LeadershipProfile {
  name: string;
  role: string;
  photoUrl: string;
  message: string[];
}

export interface TeamProfile {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
}

export const leadershipHero = {
  title: 'Founders & Leadership Team',
  subtitle:
    'Meet the leadership behind Plutonic Cleaning & Technical Services L.L.C — guiding quality, reliability, and professional service across the UAE.',
};

export const founder: LeadershipProfile = {
  name: 'Ali Ali',
  role: 'Founder & Managing Director',
  photoUrl: images.founder,
  message: [
    'Welcome to Plutonic Cleaning & Technical Services L.L.C.',
    'When I founded Plutonic from our Dubai Marina office at Marina Plaza, my aim was straightforward: create a company that families and businesses could depend on for cleaning, maintenance, and technical work — delivered on time, at fair prices, with no compromise on standards.',
    'Over the years, client confidence and growing demand have taken us beyond Dubai into Sharjah, Abu Dhabi, and every emirate in the UAE. Today we offer interior and exterior cleaning, painting, plumbing, electrical work, carpentry, tiling, and air-conditioner services for residential and commercial properties.',
    'Our success is built on trained teams, modern equipment, transparent pricing, and a simple promise: complete every job properly and make life easier for our clients. I remain personally involved in service quality, team development, and the relationships that keep Plutonic a trusted name in the region.',
    'Thank you for visiting us. We look forward to welcoming you as a Plutonic client.',
  ],
};

export const ceo: LeadershipProfile = {
  name: 'Omar Hassan',
  role: 'Chief Executive Officer',
  photoUrl: images.executive,
  message: [
    'At Plutonic, our clients expect more than a clean space — they expect reliability, clear communication, and professionals who respect their home or workplace.',
    'As Chief Executive Officer, I lead our day-to-day operations across the UAE: scheduling, field teams, quality checks, and the systems that keep every project on track. From deep cleaning in Dubai Marina to commercial maintenance in JLT and Sharjah, we follow consistent standards so results are predictable and professional.',
    'We invest in training, safety, and the right tools for each service line. Our operations team coordinates closely with clients before, during, and after every visit — so expectations are clear and issues are resolved quickly.',
    'Plutonic has served thousands of satisfied customers and completed thousands of projects. That track record reflects the discipline of our people and the trust our founder established when he built this company.',
    'Whether you need a one-time deep clean or ongoing technical support, my commitment is the same: deliver exceptional service with integrity, efficiency, and care.',
  ],
};

export const fallbackTeam: TeamProfile[] = [
  {
    name: 'Sarah Ahmed',
    role: 'Director of Operations',
    bio:
      'Sarah oversees daily service delivery across Dubai and the Northern Emirates — managing schedules, supervising field teams, and ensuring every residential and commercial job meets Plutonic\'s quality checklist before sign-off.',
    photoUrl: '/assets/team/team-1.webp',
  },
  {
    name: 'Mohammed Ali',
    role: 'Head of Technical Services',
    bio:
      'Mohammed leads our technical division specialising in deep cleaning, upholstery care, plumbing, and AC maintenance. He trains technicians on modern methods and safe handling of equipment and materials.',
    photoUrl: '/assets/team/team-2.webp',
  },
  {
    name: 'Priya Nair',
    role: 'Customer Experience Manager',
    bio:
      'Priya manages client communications, booking coordination, and follow-up after every service. She works to keep pricing transparent and ensure each customer receives clear updates from confirmation through completion.',
    photoUrl: images.team,
  },
];

export const missionStatement =
  'To deliver exceptional cleaning and technical services across the UAE — on time, at fair prices, with trained professionals and modern equipment — so every client enjoys a cleaner, safer, and more comfortable space.';
