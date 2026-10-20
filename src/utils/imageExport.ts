import { toPng } from 'html-to-image';

/**
 * Normalizes Google Drive thumbnail URLs to direct lh3.googleusercontent.com URLs
 * which provide `access-control-allow-origin: *` headers for Canvas and html-to-image.
 */
export function normalizeImageUrl(url: string | undefined): string {
  if (!url) return '';
  const driveMatch = url.match(/drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}=s500`;
  }
  return url;
}

const FALLBACK_PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" rx="20" fill="%23064e3b"/%3E%3Ctext x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" font-size="40"%3E🌱%3C/text%3E%3C/svg%3E';

/**
 * Safely exports an HTML element to a PNG data URL without triggering
 * Google Fonts cross-origin CSS security errors or image CORS errors.
 */
export async function safeExportToPng(
  element: HTMLElement,
  options?: {
    quality?: number;
    pixelRatio?: number;
    backgroundColor?: string;
  }
): Promise<string> {
  return await toPng(element, {
    quality: options?.quality ?? 0.98,
    pixelRatio: options?.pixelRatio ?? 2,
    backgroundColor: options?.backgroundColor,
    skipFonts: true, // Prevents SecurityError when accessing Google Fonts cssRules
    fontEmbedCSS: '', // Guarantees getWebFontCSS is bypassed completely, eliminating SecurityError
    imagePlaceholder: FALLBACK_PLACEHOLDER,
    onImageErrorHandler: (err) => {
      console.warn('Image export error bypassed safely:', err);
    },
    filter: (node) => {
      // Exclude elements marked with data-no-export
      if (node instanceof HTMLElement && node.dataset.noExport === 'true') {
        return false;
      }
      return true;
    },
  });
}
