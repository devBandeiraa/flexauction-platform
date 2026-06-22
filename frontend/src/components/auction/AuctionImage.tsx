import { ImageOff } from 'lucide-react';
import { firstImage } from '@/lib/media';
import { CATEGORY_LABELS } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface AuctionImageProps {
  images: string[];
  alt: string;
  category: Category;
  className?: string;
}

export function AuctionImage({ images, alt, category, className }: AuctionImageProps) {
  const src = firstImage(images);

  if (!src) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-border text-muted-foreground',
          className,
        )}
      >
        <ImageOff className="size-6" />
        <span className="text-xs font-medium">{CATEGORY_LABELS[category]}</span>
      </div>
    );
  }

  return <img src={src} alt={alt} loading="lazy" className={cn('object-cover', className)} />;
}
