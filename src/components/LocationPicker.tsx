import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../api';
import { useLocation } from '../context/LocationContext';

interface Emirate {
  _id: string;
  name: string;
}

interface City {
  _id: string;
  name: string;
  emirateId: string;
}

function normalizeId(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'object' && value !== null && '$oid' in value) {
    return String((value as { $oid: string }).$oid);
  }
  return String(value);
}

function PinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LocationModal({
  open,
  onClose,
  initialEmirateId,
  initialCityId,
  onConfirm,
  title,
  subtitle,
}: {
  open: boolean;
  onClose: () => void;
  initialEmirateId?: string;
  initialCityId?: string;
  onConfirm: (loc: { emirateId: string; emirateName: string; cityId: string; cityName: string }) => void;
  title: string;
  subtitle?: string;
}) {
  const [emirates, setEmirates] = useState<Emirate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [emirateId, setEmirateId] = useState(initialEmirateId || '');
  const [cityId, setCityId] = useState(initialCityId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    api<{ emirates: Emirate[]; cities: City[] }>('/locations')
      .then((data) => {
        setEmirates(
          data.emirates.map((e) => ({ _id: normalizeId(e._id), name: e.name }))
        );
        setCities(
          data.cities.map((c) => ({
            _id: normalizeId(c._id),
            name: c.name,
            emirateId: normalizeId(c.emirateId),
          }))
        );
      })
      .catch(() =>
        setError('Could not load locations. Make sure the server is running (npm run dev).')
      )
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setEmirateId(initialEmirateId || '');
    setCityId(initialCityId || '');
  }, [open, initialEmirateId, initialCityId]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const filteredCities = cities.filter((c) => c.emirateId === emirateId);
  const selectedEmirate = emirates.find((e) => e._id === emirateId);

  const handleConfirm = () => {
    const city = filteredCities.find((c) => c._id === cityId);
    if (emirateId && city && selectedEmirate) {
      onConfirm({
        emirateId,
        emirateName: selectedEmirate.name,
        cityId: city._id,
        cityName: city.name,
      });
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] grid place-items-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div className="absolute inset-0 bg-plutonic-dark/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-sky-900/15 max-h-[min(90vh,640px)] overflow-hidden flex flex-col animate-[slide-down_0.35s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 px-6 py-5 text-white shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-1">
                <PinIcon className="w-4 h-4" />
                Service area
              </div>
              <h2 id="location-modal-title" className="text-xl font-bold">{title}</h2>
              {subtitle && <p className="text-white/85 text-sm mt-1">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/20 transition shrink-0"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading && (
            <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
              <svg className="animate-spin w-5 h-5 mr-2 text-sky-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading locations…
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-4 mb-4">{error}</div>
          )}

          {!loading && !error && (
            <div className="space-y-5">
              <div>
                <label htmlFor="location-emirate" className="block text-sm font-semibold text-plutonic-blue-dark mb-2">
                  Emirate
                </label>
                <select
                  id="location-emirate"
                  className="input-premium cursor-pointer"
                  value={emirateId}
                  onChange={(e) => {
                    setEmirateId(e.target.value);
                    setCityId('');
                  }}
                >
                  <option value="">Select emirate</option>
                  {emirates.map((e) => (
                    <option key={e._id} value={e._id}>{e.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location-city" className="block text-sm font-semibold text-plutonic-blue-dark mb-2">
                  City / Area
                </label>
                <select
                  id="location-city"
                  className="input-premium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  disabled={!emirateId}
                >
                  <option value="">{emirateId ? 'Select city / area' : 'Select emirate first'}</option>
                  {filteredCities.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 shrink-0 bg-gray-50/80">
          <button type="button" onClick={onClose} className="btn-outline flex-1 !py-2.5">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!emirateId || !cityId}
            className="btn-primary flex-1 !py-2.5 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function LocationPicker({ compact }: { compact?: boolean }) {
  const { location, setLocation } = useLocation();
  const [open, setOpen] = useState(false);

  const handleConfirm = useCallback(
    (loc: { emirateId: string; emirateName: string; cityId: string; cityName: string }) => {
      setLocation(loc);
      setOpen(false);
    },
    [setLocation]
  );

  if (!compact) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="location-pill group flex items-center gap-1.5 sm:gap-2 h-9 min-w-0 max-w-[2.25rem] sm:max-w-[9rem] md:max-w-[11rem] pl-2 pr-2 sm:pl-3 sm:pr-2.5 rounded-full border border-sky-200/90 bg-white/90 shadow-sm hover:border-sky-400 hover:shadow-md hover:shadow-sky-100 transition-all duration-200"
        aria-label={location ? `Location: ${location.cityName}. Change location` : 'Select location'}
        title={location ? `${location.cityName}, ${location.emirateName}` : 'Select location'}
      >
        <PinIcon className="w-4 h-4 shrink-0 text-sky-500" />
        <span className="hidden sm:inline truncate text-sm font-semibold text-plutonic-blue-dark leading-none">
          {location ? location.cityName : 'Select area'}
        </span>
        <svg
          className="hidden sm:block w-3.5 h-3.5 shrink-0 text-gray-400 group-hover:text-sky-500 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <LocationModal
        open={open}
        onClose={() => setOpen(false)}
        initialEmirateId={location?.emirateId}
        initialCityId={location?.cityId}
        onConfirm={handleConfirm}
        title="Change location"
        subtitle="Select your emirate and service area."
      />
    </>
  );
}

export function LocationGate({ children }: { children: React.ReactNode }) {
  const { location, ready, setLocation } = useLocation();

  const handleWelcomeConfirm = useCallback(
    (loc: { emirateId: string; emirateName: string; cityId: string; cityName: string }) => {
      setLocation(loc);
    },
    [setLocation]
  );

  if (!ready) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-sky-600 to-sky-400 z-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <LocationModal
        open
        onClose={() => {}}
        onConfirm={handleWelcomeConfirm}
        title="Welcome to Plutonic"
        subtitle="Select your location to see accurate prices and book services."
      />
    );
  }

  return <>{children}</>;
}
