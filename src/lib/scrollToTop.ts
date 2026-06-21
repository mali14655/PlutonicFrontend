type ScrollOptions = {
  smooth?: boolean;
  /** Element id to scroll to (uses header offset). Falls back to page top. */
  anchorId?: string;
  /** Extra px above anchor (defaults to --header-height) */
  offset?: number;
};

function getHeaderOffset(extra = 0): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim();
  const header = parseFloat(raw) || 52;
  return header + extra;
}

function blurActiveElement() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

/** Run after React has committed DOM updates */
export function scrollAfterPaint(fn: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}

export function scrollToTop(options: ScrollOptions | boolean = {}) {
  const opts: ScrollOptions = typeof options === 'boolean' ? { smooth: options } : options;
  const smooth = opts.smooth ?? true;
  const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto';

  blurActiveElement();

  const run = () => {
    if (opts.anchorId) {
      const el = document.getElementById(opts.anchorId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - (opts.offset ?? getHeaderOffset(8));
        window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior });
  };

  if (smooth) {
    scrollAfterPaint(run);
  } else {
    run();
    scrollAfterPaint(run);
    setTimeout(run, 50);
  }
}

/** Instant scroll to booking wizard top — reliable on mobile after step change */
export function scrollBookWizardToTop() {
  scrollToTop({ smooth: false, anchorId: 'book-top', offset: getHeaderOffset(8) });
}
