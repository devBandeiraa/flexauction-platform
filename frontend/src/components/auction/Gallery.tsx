import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { resolveImageUrl } from '@/lib/media';
import { CATEGORY_LABELS } from '@/lib/format';
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

  if (resolved.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-secondary to-border text-muted-foreground">
        <ImageOff className="size-10" />
        <span className="text-sm font-medium">{CATEGORY_LABELS[category]}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-card">
        <img src={resolved[active]} alt={title} className="size-full object-cover" />
      </div>
      {resolved.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {resolved.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'size-20 shrink-0 overflow-hidden rounded-md border-2',
                i === active ? 'border-accent' : 'border-transparent',
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
