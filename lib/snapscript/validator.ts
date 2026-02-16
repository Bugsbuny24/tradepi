const DANGEROUS_PATTERNS = [
  /process\./,
  /window\./,
  /document\./,
  /eval\(/,
  /Function\(/,
  /localStorage/,
  /cookie/
];

export function validateScriptSafety(code: string): { valid: boolean; error?: string } {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return { 
        valid: false, 
        error: `Güvenlik Riski: Script içinde yasaklı ifade tespit edildi (${pattern}).` 
      };
    }
  }

  if (code.length > 5000) {
    return { valid: false, error: 'Script çok uzun (Maksimum 5000 karakter).' };
  }

  return { valid: true };
}
