// lib/membership.ts

export function membershipActive(expiresAt?: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() > Date.now();
}

export function addOneYear(base: Date) {
  const d = new Date(base);
  d.setFullYear(d.getFullYear() + 1);
  return d;
}
