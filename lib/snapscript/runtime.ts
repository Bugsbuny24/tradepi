import { parseSnapScript } from "./parser";

export function runSnapScript(code: string) {
  const ast = parseSnapScript(code);

  return {
    ok: true,
    ast,
    output: `SnapScript executed.\nLines:\n- ${ast.lines.join("\n- ")}`,
  };
}
