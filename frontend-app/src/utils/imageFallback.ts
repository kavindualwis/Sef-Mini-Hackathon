import React from 'react';

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80';

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  Plumbing: '/images/plumbing.jpg',
  Electrical: '/images/electrical.jpg',
  'Home Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  Painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80',
  'AC Repair': 'https://images.unsplash.com/photo-1631545806682-15f573f55099?w=800&q=80',
  'Vehicle Service': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&q=80',
  'Tech Support': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80',
  Carpentry: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80',
  Gardening: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
  Roofing: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=800&q=80',
  'Pest Control': 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&q=80',
  'Appliance Repair': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
};

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  category?: string
) => {
  const target = e.currentTarget;
  const fallback = (category && CATEGORY_FALLBACK_IMAGES[category]) || DEFAULT_FALLBACK_IMAGE;
  // Prevent infinite loop if fallback image also fails
  if (target.src.includes(fallback) || target.src === fallback) {
    if (fallback !== DEFAULT_FALLBACK_IMAGE) {
      target.src = DEFAULT_FALLBACK_IMAGE;
    }
  } else {
    target.src = fallback;
  }
};
