import { useState } from 'react';
import { firstImage } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface AuctionImageProps {
  images: string[];
  alt: string;
  category: Category;
  className?: string;
}

const UNSPLASH = '?auto=format&fit=crop&w=800&q=80';

// Coherent fallback photos per category — never a blank gray box.
const FALLBACKS: Record<Category, string[]> = {
  IMOVEL: [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  ],
  VEICULO: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    'https://images.unsplash.com/photo-1549924231-f129b911e442',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
  ],
  GALPAO: [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
    'https://images.unsplash.com/photo-1565891741441-64926e441838',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
  ],
  MAQUINA: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc',
  ],
  EMBARCACAO: [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a',
    'https://images.unsplash.com/photo-1540946485063-a40da27545f8',
  ],
  OUTROS: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
  ],
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function fallbackFor(category: Category, seed: string): string {
  const pool = FALLBACKS[category] ?? FALLBACKS.OUTROS;
  return pool[hash(seed) % pool.length] + UNSPLASH;
}

/**
 * Lot image with a category-coherent fallback, skeleton while loading and an
 * onError swap. Real uploaded images win; otherwise a deterministic Unsplash
 * photo for the category is shown.
 */
export function AuctionImage({ images, alt, category, className }: AuctionImageProps) {
  const real = firstImage(images);
  const fallback = fallbackFor(category, alt || category);
  const [src, setSrc] = useState(real ?? fallback);
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={cn('relative block overflow-hidden', className)}>
      {!loaded && <span className="absolute inset-0 animate-pulse bg-secondary" aria-hidden />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (src !== fallback) setSrc(fallback);
          else setLoaded(true);
        }}
        className={cn(
          'size-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </span>
  );
}
