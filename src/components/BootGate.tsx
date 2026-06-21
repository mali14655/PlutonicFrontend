import { useEffect, useState, type ReactNode } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import AppLoader from './AppLoader';

const MIN_SPLASH_MS = 1400;

export default function BootGate({ children }: { children: ReactNode }) {
  const { pathname } = useRouterLocation();
  const { ready } = useLocation();
  const skipSplash = pathname.startsWith('/admin') || pathname.startsWith('/reschedule');

  const [minTimeDone, setMinTimeDone] = useState(skipSplash);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(skipSplash);

  useEffect(() => {
    if (skipSplash) return;
    const t = setTimeout(() => setMinTimeDone(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, [skipSplash]);

  const appReady = skipSplash || (minTimeDone && ready);

  useEffect(() => {
    if (!appReady || hidden) return;
    setExiting(true);
    const t = setTimeout(() => setHidden(true), 520);
    return () => clearTimeout(t);
  }, [appReady, hidden]);

  return (
    <>
      {children}
      {!hidden && (
        <div className="fixed inset-0 z-[200] pointer-events-auto">
          <AppLoader exiting={exiting} />
        </div>
      )}
    </>
  );
}
