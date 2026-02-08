import { tokenize } from "./tokenize";
import { parse } from "./parser";
import { run } from "./runtime";
import type { SnapContext, SnapResult } from "./types";

export function compile(script: string) {
  const tokens = tokenize(script);
  return parse(tokens);
}

export function execute(script: string, ctx: SnapContext): SnapResult {
  const program = compile(script);
  return run(program, ctx);
}

export type { SnapContext, SnapResult };
