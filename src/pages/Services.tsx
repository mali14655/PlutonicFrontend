import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useLocation } from '../context/LocationContext';
import BookServiceLink from '../components/BookServiceLink';
import { categoryFallback, getCategoryImageUrl, getServiceImageUrl, onImgError, serviceFallback } from '../lib/images';
import { EmptyState, PageContent, PageHeader } from '../components/PageLayout';

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
  durationMinutes: number;
  priceAed: number | null;
}

export default function Services() {
  const { location } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<{ category: Category; subServices: SubService[] }[]>([]);
  const [loading, setLoading] = useState(true);

  const activeSlug = searchParams.get('category') || data[0]?.category.slug || '';

  useEffect(() => {
    if (!location?.cityId) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api<{ category: Category; subServices: SubService[] }[]>(
      `/sub-services/with-prices?cityId=${location.cityId}`
    )
      .then((groups) => {
        setData(groups);
        const param = searchParams.get('category');
        if (!param && groups[0]) {
          setSearchParams({ category: groups[0].category.slug }, { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [location?.cityId]);

  const activeGroup = data.find((g) => g.category.slug === activeSlug) ?? data[0];

  const selectCategory = (slug: string) => {
    setSearchParams({ category: slug });
  };

  if (!location) {
    return <EmptyState>Please select your location to view services and prices.</EmptyState>;
  }

  return (
    <PageContent>
      <PageHeader
        animate={false}
        title="Our Services"
        subtitle={`Prices for ${location.cityName}, ${location.emirateName}`}
      />

      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/book" className="btn-primary">
          Book a service →
        </Link>
      </div>

      {data.length > 0 && (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 -mx-1 px-1 flex-nowrap sm:flex-wrap scrollbar-none">
          {data.map(({ category }) => (
            <button
              key={category._id}
              type="button"
              onClick={() => selectCategory(category.slug)}
              className={`pill ${activeSlug === category.slug ? 'pill-active' : 'pill-inactive'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 rounded-full border-4 border-plutonic-blue/20 border-t-plutonic-blue animate-spin" />
        </div>
      )}

      {!loading && activeGroup && (
        <div>
          <div className="premium-card-glow p-5 mb-6 flex items-center gap-4">
            <img
              src={getCategoryImageUrl(activeGroup.category.slug, activeGroup.category.imageUrl)}
              alt={activeGroup.category.name}
              className="w-16 h-16 rounded-xl object-cover shadow-md shrink-0"
              onError={(e) => onImgError(e, categoryFallback(activeGroup.category.slug, activeGroup.category.name))}
            />
            <div>
              <h2 className="text-xl font-bold text-plutonic-blue-dark">{activeGroup.category.name}</h2>
              <p className="text-gray-600 text-sm mt-0.5">{activeGroup.category.description}</p>
            </div>
          </div>

          {activeGroup.subServices.length === 0 ? (
            <p className="text-gray-500">No services in this category yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeGroup.subServices.map((s) => (
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
                  <div className="relative h-36 overflow-hidden">
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
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-base text-plutonic-blue-dark leading-snug group-hover:text-plutonic-blue transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed flex-1">{s.description}</p>
                    <div
                      className="grid grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-sky-100/80"
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
            </div>
          )}
        </div>
      )}

      {!loading && data.length === 0 && (
        <p className="text-gray-500 text-center py-12 premium-card-glow p-8">
          No services available for your location.
        </p>
      )}
    </PageContent>
  );
}
