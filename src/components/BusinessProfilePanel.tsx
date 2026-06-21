import { useEffect, useState, type ReactNode } from 'react';
import { api } from '../api';
import { images } from '../lib/images';
import {
  OFFICE_LOCATION,
  buildDirectionsUrl,
  buildMapsEmbedUrl,
  buildMapsUrl,
} from '../lib/officeLocation';

interface GoogleReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTime?: string;
  profilePhotoUrl?: string;
}

interface GoogleBusinessLive {
  live: boolean;
  name?: string;
  rating?: number;
  reviewCount?: number;
  reviewsUrl?: string;
  mapsUrl?: string;
  directionsUrl?: string;
  formattedAddress?: string;
  website?: string;
  category?: string;
  buildingName?: string;
  photoUrl?: string;
  exteriorPhotoUrl?: string;
  mapsEmbedUrl?: string;
  reviews?: GoogleReview[];
  cachedAt?: string;
  message?: string;
}

interface BusinessInfo {
  companyName: string;
  address: string;
  phone: string;
  phoneAlt?: string;
  whatsapp: string;
  email: string;
  website: string;
}

const FALLBACK = {
  photoUrl: images.cleaning,
  mapsEmbedUrl: buildMapsEmbedUrl(),
  mapsUrl: buildMapsUrl(),
  directionsUrl: buildDirectionsUrl(),
  category: 'Cleaning service in Dubai, United Arab Emirates',
  buildingName: OFFICE_LOCATION.buildingName,
};

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'xs' }) {
  const stars = [1, 2, 3, 4, 5];
  const cls = size === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {stars.map((n) => {
        const filled = rating >= n;
        const half = !filled && rating >= n - 0.5;
        return (
          <svg key={n} className={`${cls} ${filled || half ? 'text-amber-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            {half ? (
              <defs>
                <linearGradient id={`half-${n}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#d1d5db" />
                </linearGradient>
              </defs>
            ) : null}
            <path
              fill={half ? `url(#half-${n})` : 'currentColor'}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      })}
    </div>
  );
}

function ActionBtn({
  href,
  icon,
  label,
  external = true,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-plutonic-blue-dark shadow-sm hover:border-sky-400 hover:bg-sky-50 hover:shadow-md transition-all duration-200 shrink-0"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

export default function BusinessProfilePanel() {
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [google, setGoogle] = useState<GoogleBusinessLive | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<BusinessInfo | { businessInfo?: BusinessInfo }>('/settings/public')
      .then((data) => {
        const info = 'businessInfo' in data ? data.businessInfo : null;
        if (info) setBusiness(info);
      })
      .catch(() => {});

    api<GoogleBusinessLive>('/google-business')
      .then(setGoogle)
      .catch(() => setGoogle({ live: false }))
      .finally(() => setLoading(false));
  }, []);

  const name = google?.name || business?.companyName?.replace(' L.L.C', '') || 'Plutonic Cleaning Services';
  const phone = business?.phone || '+971 56 1615616';
  const phoneDial = phone.replace(/\s/g, '');
  const whatsapp = business?.whatsapp?.replace(/\D/g, '') || '971561615616';
  const website = google?.website || business?.website || 'https://plutoniccleaningandtech.com';
  const address = google?.formattedAddress || business?.address || 'Office #411, Marina Plaza, Dubai Marina, Dubai, UAE';
  const mapsUrl = google?.mapsUrl || FALLBACK.mapsUrl;
  const directionsUrl = google?.directionsUrl || FALLBACK.directionsUrl;
  const reviewsUrl = google?.reviewsUrl || mapsUrl;
  const photoUrl = google?.photoUrl || FALLBACK.photoUrl;
  const mapsEmbedUrl = google?.mapsEmbedUrl || FALLBACK.mapsEmbedUrl;
  const category = google?.category || FALLBACK.category;
  const buildingName = google?.buildingName || FALLBACK.buildingName;
  const rating = google?.rating;
  const reviewCount = google?.reviewCount;
  const reviews = google?.reviews?.filter((r) => r.text) ?? [];

  return (
    <section className="premium-card-glow overflow-hidden">
      {/* Single image + full map */}
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[220px] md:min-h-[360px] bg-sky-100">
          <img
            src={photoUrl}
            alt="Plutonic professional cleaning service"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plutonic-dark/25 to-transparent pointer-events-none" />
        </div>

        <div className="relative min-h-[280px] md:min-h-[360px] border-t md:border-t-0 md:border-l border-sky-100 bg-sky-50">
          <iframe
            title="Plutonic office — Office #411, Marina Plaza, Dubai Marina"
            src={mapsEmbedUrl}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Exact location label */}
          <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-[min(100%,280px)] rounded-xl bg-white/95 px-3 py-2.5 shadow-lg border border-sky-100 pointer-events-none">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Our office</p>
            <p className="text-xs font-semibold text-plutonic-blue-dark leading-snug mt-0.5">
              Office #411, {buildingName}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Dubai Marina, Dubai</p>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 justify-end">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-sky-600 transition"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Get directions
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-xs font-semibold text-plutonic-blue-dark shadow-lg border border-sky-100 hover:bg-white transition"
            >
              <svg className="w-4 h-4 text-sky-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Open in Maps
            </a>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {google?.live && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V9h2v7zm4 0h-2V9h2v7z" />
                  </svg>
                  Live from Google
                </span>
              )}
              {google?.cachedAt && google.live && (
                <span className="text-[10px] text-gray-400">
                  Updated {new Date(google.cachedAt).toLocaleString()}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-plutonic-blue-dark tracking-tight">{name}</h2>

            {loading ? (
              <p className="text-sm text-gray-500 mt-2">Loading ratings…</p>
            ) : rating != null && reviewCount != null ? (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                <span className="text-lg font-bold text-plutonic-blue-dark">{rating.toFixed(1)}</span>
                <StarRating rating={rating} />
                <a
                  href={reviewsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-plutonic-blue hover:text-sky-600 transition"
                >
                  {reviewCount} Google reviews
                </a>
              </div>
            ) : (
              <a
                href={reviewsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-plutonic-blue hover:text-sky-600 transition mt-2 inline-block"
              >
                View on Google →
              </a>
            )}
            <p className="text-gray-500 text-sm mt-2">{category}</p>
          </div>
          <img src="/assets/branding/logo.png" alt="" className="h-10 w-auto object-contain shrink-0 hidden sm:block opacity-90" />
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          <ActionBtn href={website} label="Website" icon={
            <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
          } />
          <ActionBtn href={directionsUrl} label="Directions" icon={
            <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          } />
          <ActionBtn href={`tel:${phoneDial}`} label="Call" external={false} icon={
            <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          } />
          <ActionBtn href={`https://wa.me/${whatsapp}`} label="WhatsApp" icon={
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
          } />
          <ActionBtn href={reviewsUrl} label="Reviews" icon={
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          } />
        </div>

        {reviews.length > 0 && (
          <div className="mt-8 pt-6 border-t border-sky-100">
            <h3 className="font-bold text-plutonic-blue-dark mb-4">Recent Google reviews</h3>
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review, i) => (
                <div key={i} className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {review.profilePhotoUrl ? (
                      <img src={review.profilePhotoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center text-xs font-bold text-sky-700">
                        {review.authorName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm text-plutonic-blue-dark">{review.authorName}</p>
                      {review.relativeTime && <p className="text-xs text-gray-500">{review.relativeTime}</p>}
                    </div>
                    <div className="ml-auto">
                      <StarRating rating={review.rating} size="xs" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
            <a
              href={reviewsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 text-sm font-semibold text-plutonic-blue hover:text-sky-600"
            >
              Read all reviews on Google →
            </a>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-sky-100 space-y-3 text-sm">
          <p className="text-gray-600">
            <span className="font-semibold text-plutonic-blue-dark">Located in: </span>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-plutonic-blue font-medium hover:text-sky-600">
              {buildingName}
            </a>
          </p>
          <p className="text-gray-600 leading-relaxed">
            <span className="font-semibold text-plutonic-blue-dark">Address: </span>
            {address}
          </p>
        </div>
      </div>
    </section>
  );
}
