import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * On route change: scroll to the top and move focus to the page's <h1> so
 * keyboard/screen-reader users land at the new content.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const h1 = document.querySelector('h1');
    if (h1) {
      h1.setAttribute('tabindex', '-1');
      (h1 as HTMLElement).focus({ preventScroll: true });
    }
  }, [pathname]);

  return null;
}
