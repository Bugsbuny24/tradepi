declare global {
  interface Window {
    Pi?: any;
  }
}

export function ensurePiReady() {
  return typeof window !== "undefined" && !!window.Pi;
}
