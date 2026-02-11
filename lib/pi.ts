export function isPiBrowser(): boolean {
  if (typeof window === "undefined") return false;
  // Pi Browser genelde navigator.userAgent içinde "PiBrowser" taşır
  return /PiBrowser/i.test(navigator.userAgent) || !!(window as any).Pi;
}

export async function waitForPi(timeoutMs = 6000): Promise<any | null> {
  const start = Date.now();

  return new Promise((resolve) => {
    const tick = () => {
      const Pi = (window as any).Pi;
      if (Pi) return resolve(Pi);

      if (Date.now() - start > timeoutMs) return resolve(null);

      setTimeout(tick, 120);
    };
    tick();
  });
}
