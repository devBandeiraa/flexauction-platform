import { useState } from 'react';
import { resolveImageUrl } from '@/lib/media';
import { AuctionImage } from './AuctionImage';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface GalleryProps {
  images: string[];
  title: string;
  category: Category;
}

export function Gallery({ images, title, category }: GalleryProps) {
  const [active, setActive] = useState(0);
  const resolved = images.map((img) => resolveImageUrl(img)).filter(Boolean) as string[];

  // No real images: show the category-coherent fallback (same logic as the cards).
  if (resolved.length === 0) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line shadow-card">
        <AuctionImage images={[]} alt={title} category={category} className="size-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <img src={resolved[active]} alt={title} className="size-full object-cover" />
      </div>
      {resolved.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {resolved.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagem ${i + 1} de ${title}`}
              className={cn(
                'size-20 shrink-0 overflow-hidden rounded-xl border-2',
                i === active ? 'border-brand-pink' : 'border-transparent',
              )}
            >
              <img src={img} alt={`${title} ${i + 1}`} className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
