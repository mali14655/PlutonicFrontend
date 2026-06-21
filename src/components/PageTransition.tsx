import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { scrollToTop } from '../lib/scrollToTop';

export default function PageTransition() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'enter' | 'exit' | 'idle'>('enter');

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) return;

    scrollToTop({ smooth: true });

    setTransitionStage('exit');
    const timer = setTimeout(() => {
      setDisplayLocation(location);
      setTransitionStage('enter');
    }, 180);

    return () => clearTimeout(timer);
  }, [location, displayLocation.pathname]);

  useEffect(() => {
    if (transitionStage === 'enter') {
      const timer = setTimeout(() => setTransitionStage('idle'), 500);
      return () => clearTimeout(timer);
    }
  }, [transitionStage, displayLocation.pathname]);

  return (
    <div
      className={`page-transition ${
        transitionStage === 'exit' ? 'page-exit' : transitionStage === 'enter' ? 'page-enter' : ''
      }`}
    >
      <Outlet key={displayLocation.pathname} />
    </div>
  );
}
