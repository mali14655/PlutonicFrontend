import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../lib/scrollToTop';

/** Smooth scroll to top on every route change */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    scrollToTop({ smooth: true });
  }, [pathname, search]);

  return null;
}
