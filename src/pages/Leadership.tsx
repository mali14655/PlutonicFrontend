import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import AnimateIn, { StaggerGroup } from '../components/AnimateIn';
import { PageContent, PageHero, SectionHeader } from '../components/PageLayout';
import {
  ceo,
  fallbackTeam,
  founder,
  leadershipHero,
  missionStatement,
  type TeamProfile,
} from '../lib/leadershipContent';
import { images, onImgError } from '../lib/images';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
}

function LeaderSpotlight({
  label,
  heading,
  person,
  imagePosition = 'left',
  message,
}: {
  label: string;
  heading: string;
  person: { name: string; role: string; photoUrl: string };
  imagePosition?: 'left' | 'right';
  message: string[];
}) {
  const imageBlock = (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-200/50 via-sky-100/30 to-plutonic-gold/10 blur-2xl"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(3,105,161,0.18)] ring-1 ring-sky-200/60">
        <img
          src={person.photoUrl}
          alt={person.name}
          className="w-full aspect-[4/5] object-cover object-top"
          onError={(e) => onImgError(e, images.team)}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-plutonic-dark/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="font-bold text-lg drop-shadow-sm">{person.name}</p>
          <p className="text-sm text-white/85">{person.role}</p>
        </div>
      </div>
    </div>
  );

  const textBlock = (
    <div className="lg:py-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-plutonic-blue">{label}</p>
      <h2 className="text-3xl md:text-4xl font-extrabold text-plutonic-blue-dark tracking-tight mt-3 leading-tight">
        {heading}
      </h2>
      <p className="text-plutonic-blue font-semibold text-lg mt-2">{person.role}</p>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed text-base">
        {message.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-4">
        <div className="h-1 w-14 rounded-full bg-gradient-to-r from-plutonic-blue to-plutonic-gold" />
        <p className="text-sm font-bold text-plutonic-blue-dark">{person.name}</p>
      </div>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      {imagePosition === 'left' ? (
        <>
          <AnimateIn variant="fade-up">{imageBlock}</AnimateIn>
          <AnimateIn variant="fade-up" delay={80}>{textBlock}</AnimateIn>
        </>
      ) : (
        <>
          <AnimateIn variant="fade-up" className="lg:order-1">{textBlock}</AnimateIn>
          <AnimateIn variant="fade-up" delay={80} className="lg:order-2">{imageBlock}</AnimateIn>
        </>
      )}
    </div>
  );
}

function TeamCard({ member }: { member: TeamProfile }) {
  return (
    <div className="premium-card-glow overflow-hidden group h-full flex flex-col">
      <div className="relative aspect-[5/4] overflow-hidden bg-sky-50">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => onImgError(e, images.team)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 text-white text-4xl font-bold">
            {member.name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-plutonic-dark/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-extrabold text-lg text-plutonic-blue-dark">{member.name}</h3>
        <p className="text-sm text-plutonic-blue font-semibold mt-1">{member.role}</p>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed flex-1">{member.bio}</p>
      </div>
    </div>
  );
}

export default function Leadership() {
  const [team, setTeam] = useState<TeamProfile[]>(fallbackTeam);

  useEffect(() => {
    api<TeamMember[]>('/team')
      .then((data) => {
        if (data.length > 0) setTeam(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Our Leadership"
        title={leadershipHero.title}
        subtitle={leadershipHero.subtitle}
        image={images.team}
        gradient="from-plutonic-dark/85 to-sky-900/80"
      />

      <PageContent>
        <section className="mb-20 md:mb-28">
          <LeaderSpotlight
            label="Founder"
            heading="Founder's Message"
            person={founder}
            imagePosition="left"
            message={founder.message}
          />
        </section>

        <section className="mb-20 md:mb-28 mesh-sky-bg rounded-3xl p-8 md:p-12 lg:p-14 border border-sky-100/80">
          <LeaderSpotlight
            label="Executive"
            heading="CEO's Message"
            person={ceo}
            imagePosition="right"
            message={ceo.message}
          />
        </section>

        <SectionHeader
          center
          eyebrow="Our people"
          title="Leadership & Team"
          subtitle="Operations, technical, and client-care specialists who deliver Plutonic's standards on every job across the UAE."
        />
        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" stagger={90}>
          {team.map((m, i) => (
            <TeamCard key={i} member={m} />
          ))}
        </StaggerGroup>

        <AnimateIn variant="fade-up" delay={100} className="mt-16 md:mt-20 premium-card-glow p-8 md:p-10 text-center">
          <h2 className="text-xl font-bold text-plutonic-blue-dark">Our mission</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed">{missionStatement}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link to="/company-profile" className="btn-outline">Company profile</Link>
            <Link to="/contact" className="btn-outline">Contact us</Link>
            <Link to="/book" className="btn-primary">Book a service</Link>
          </div>
        </AnimateIn>
      </PageContent>
    </div>
  );
}
