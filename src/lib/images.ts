/** Curated premium imagery — local HD assets + Unsplash fallbacks */
export const images = {
  hero: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=85&auto=format&fit=crop',
  heroAlt: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1920&q=85&auto=format&fit=crop',
  cleaning: '/assets/services/deep-cleaning.png',
  birds: '/assets/services/bird-netting.png',
  pest: '/assets/services/pest-control.png',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format&fit=crop',
  team: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=85&auto=format&fit=crop',
  founder: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=85&auto=format&fit=crop',
  executive: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85&auto=format&fit=crop',
  contact: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&q=85&auto=format&fit=crop',
  adminBg: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=85&auto=format&fit=crop',
};

const HD = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&q=90&auto=format&fit=crop`;

/** Local generated HD service photos */
export const localServiceImages: Record<string, string> = {
  'deep-cleaning': '/assets/services/deep-cleaning.png',
  'sofa-cleaning': '/assets/services/sofa-cleaning.png',
  'carpet-cleaning': '/assets/services/carpet-cleaning.png',
  'move-in-out': '/assets/services/move-in-out.png',
  'bird-netting': '/assets/services/bird-netting.png',
  'pigeon-control': '/assets/services/pigeon-control.png',
  'pest-control': '/assets/services/pest-control.png',
  'rodent-control': '/assets/services/rodent-control.png',
};

/** Unsplash HD fallbacks when local asset unavailable */
export const serviceImages: Record<string, string> = {
  'deep-cleaning': HD('photo-1628177142898-93e36e4e3a50'),
  'sofa-cleaning': HD('photo-1555041469-a586c61ea9bc'),
  'carpet-cleaning': HD('photo-1583847268968-b722dc8ee13f'),
  'move-in-out': HD('photo-1560448204-e02f11c3d0e2'),
  'bird-netting': HD('photo-1516934219879-9e0c84b27c8d'),
  'pigeon-control': HD('photo-1552728080-326912e773e3'),
  'pest-control': HD('photo-1585421514738-01798f55b440'),
  'rodent-control': HD('photo-1530836369751-017bcf6f4efa'),
};

export const localCategoryImages: Record<string, string> = {
  cleaning: '/assets/categories/cleaning.png',
  'birds-control': '/assets/categories/birds-control.png',
  'pets-control': '/assets/categories/pets-control.png',
};

export const categoryImages: Record<string, string> = {
  cleaning: HD('photo-1628177142898-93e36e4e3a50', 1200, 600),
  'birds-control': HD('photo-1606567593634-58793a3b265a', 1200, 600),
  'pets-control': HD('photo-1585421514738-01798f55b440', 1200, 600),
};

export function getServiceImageUrl(slug: string, remoteUrl?: string): string {
  if (localServiceImages[slug]) return localServiceImages[slug];
  if (remoteUrl && !remoteUrl.includes('w=200') && !remoteUrl.includes('placehold.co')) {
    return remoteUrl;
  }
  return serviceImages[slug] || images.cleaning;
}

export function getCategoryImageUrl(slug: string, remoteUrl?: string): string {
  if (localCategoryImages[slug]) return localCategoryImages[slug];
  if (remoteUrl && !remoteUrl.includes('w=200') && !remoteUrl.includes('placehold.co')) {
    return remoteUrl;
  }
  return categoryImages[slug] || images.cleaning;
}

export function serviceFallback(slug: string, name: string): string {
  return getServiceImageUrl(slug) || getServiceImageUrl(name.toLowerCase().replace(/\s+/g, '-'));
}

export function categoryFallback(slug: string, name: string): string {
  return getCategoryImageUrl(slug) || getCategoryImageUrl(name.toLowerCase().replace(/\s+/g, '-'));
}

export function onImgError(
  e: { currentTarget: HTMLImageElement },
  fallback: string,
  altFallback?: string
) {
  const img = e.currentTarget;
  if (altFallback && img.src !== altFallback) {
    img.src = altFallback;
    return;
  }
  if (img.src !== fallback) img.src = fallback;
}
