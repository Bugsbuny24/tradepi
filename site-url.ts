import type { NextRequest } from 'next/server';

/**
 * Returns the canonical site URL for redirects/emails.
 * Preference order:
 * 1) NEXT_PUBLIC_SITE_URL
 * 2) SITE_URL
 * 3) request host (when available)
 */
export function getSiteUrl(req?: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');

  if (req) {
    const proto = req.headers.get('x-forwarded-proto') || req.nextUrl.protocol.replace(':', '');
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
    return `${proto}://${host}`.replace(/\/$/, '');
  }

  return 'http://localhost:3000';
}
