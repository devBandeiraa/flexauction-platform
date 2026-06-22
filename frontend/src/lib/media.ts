import { API_URL } from '@/services/api';

// The backend serves uploaded files from its origin (e.g. http://localhost:3001/uploads/x.jpg),
// which is the API URL without the trailing /api path segment.
const ASSET_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export function resolveImageUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${ASSET_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function firstImage(images: string[]): string | undefined {
  return resolveImageUrl(images[0]);
}
