export type SnapScriptAST = {
  lines: string[];
};

export function parseSnapScript(code: string): SnapScriptAST {
  const lines = code
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return { lines };
}
