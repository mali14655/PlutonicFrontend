import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../api';

export interface LocationState {
  emirateId: string;
  emirateName: string;
  cityId: string;
  cityName: string;
}

interface LocationContextValue {
  location: LocationState | null;
  setLocation: (loc: LocationState) => void;
  clearLocation: () => void;
  ready: boolean;
}

const STORAGE_KEY = 'plutonic_location';

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setReady(true);
      return;
    }

    api<{ emirates: { _id: string; name: string }[]; cities: { _id: string; name: string; emirateId: string }[] }>(
      '/locations'
    )
      .then((data) => {
        try {
          const saved = JSON.parse(raw) as LocationState;
          const city = data.cities.find((c) => String(c._id) === String(saved.cityId));
          const emirate = data.emirates.find((e) => String(e._id) === String(saved.emirateId));
          if (city && emirate) {
            setLocationState({
              emirateId: String(emirate._id),
              emirateName: emirate.name,
              cityId: String(city._id),
              cityName: city.name,
            });
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      })
      .catch(() => {
        try {
          setLocationState(JSON.parse(raw));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const setLocation = (loc: LocationState) => {
    const normalized = {
      emirateId: String(loc.emirateId),
      emirateName: loc.emirateName,
      cityId: String(loc.cityId),
      cityName: loc.cityName,
    };
    setLocationState(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  };

  const clearLocation = () => {
    setLocationState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, clearLocation, ready }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
