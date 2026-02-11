// lib/site-url.ts
export function getSiteUrl() {
  // Vercel preview URLs
  const vercelUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  // Production site URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) return siteUrl;

  // Fallback for local dev
  return "http://localhost:3000";
}

// Shared cookie domain for production (www + apex ortak çalışsın diye)
export function getSharedCookieDomain(hostname?: string) {
  const host =
    hostname || process.env.NEXT_PUBLIC_COOKIE_DOMAIN || process.env.COOKIE_DOMAIN;

  // Eğer .tradepigloball.co gibi verilmişse aynen döndür
  if (host?.startsWith(".")) return host;

  // www.tradepigloball.co -> .tradepigloball.co
  if (host && host.includes(".")) {
    const parts = host.split(".");
    if (parts.length >= 2) {
      const base = parts.slice(-2).join(".");
      return `.${base}`;
    }
  }

  return undefined;
}
