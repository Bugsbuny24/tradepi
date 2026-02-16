/**
 * SnapScript Sandbox Mührü
 * Yasaklı API'leri ve objeleri filtreler.
 */

const FORBIDDEN_KEYS = [
  'process', 'env', 'global', 'window', 'document', 
  'fetch', 'XMLHttpRequest', 'eval', 'Function', 
  'setTimeout', 'setInterval', 'import'
];

export function createSealedContext(initialData: any) {
  // Scriptin erişebileceği güvenli objeler
  const safeContext = {
    data: initialData,
    Math: Math,
    JSON: {
      parse: JSON.parse,
      stringify: JSON.stringify
    },
    console: {
      log: (...args: any[]) => console.log('[SnapScript Log]:', ...args)
    }
  };

  // Proxy kullanarak yasaklı alanlara erişimi engelliyoruz
  return new Proxy(safeContext, {
    get(target, prop: string) {
      if (FORBIDDEN_KEYS.includes(prop)) {
        throw new Error(`Güvenlik İhlali: '${prop}' API'sine erişim SnapScript tarafından engellendi.`);
      }
      return (target as any)[prop];
    },
    has(target, prop: string) {
      return prop in target || FORBIDDEN_KEYS.includes(prop);
    }
  });
}
