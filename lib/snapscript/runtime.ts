import { Expr, Program } from "./ast";
import { makeBuiltins } from "./builtins";
import { SnapContext, SnapResult } from "./types";

type Val = number | string | boolean;

function toBool(v: Val): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return v.length > 0;
  return Boolean(v);
}

function toNum(v: Val): number {
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function toStr(v: Val): string {
  return typeof v === "string" ? v : String(v);
}

export function run(program: Program, ctx: SnapContext): SnapResult {
  const builtins = makeBuiltins(ctx);

  const result: SnapResult = {
    style: { highlights: [], badges: [] },
    events: [],
  };

  const evalExpr = (e: Expr): Val => {
    switch (e.k) {
      case "num":
        return e.v;
      case "str":
        return e.v;
      case "id":
        // allow simple identifiers only for builtins with no args? v0: no.
        // treat unknown ids as 0/false
        return 0;
      case "call": {
        const fn = (builtins as any)[e.name];
        if (typeof fn !== "function") return 0;
        const args = e.args.map(evalExpr);
        return fn(...args);
      }
      case "unary": {
        const v = evalExpr(e.rhs);
        if (e.op === "not") return !toBool(v);
        if (e.op === "-") return -toNum(v);
        return 0;
      }
      case "bin": {
        const a = evalExpr(e.lhs);
        const b = evalExpr(e.rhs);

        switch (e.op) {
          case "and":
            return toBool(a) && toBool(b);
          case "or":
            return toBool(a) || toBool(b);
          case "==":
            return toStr(a) === toStr(b);
          case "!=":
            return toStr(a) !== toStr(b);
          case ">":
            return toNum(a) > toNum(b);
          case "<":
            return toNum(a) < toNum(b);
          case ">=":
            return toNum(a) >= toNum(b);
          case "<=":
            return toNum(a) <= toNum(b);
          case "+":
            // string concat if any is string
            if (typeof a === "string" || typeof b === "string") return toStr(a) + toStr(b);
            return toNum(a) + toNum(b);
          case "-":
            return toNum(a) - toNum(b);
          case "*":
            return toNum(a) * toNum(b);
          case "/":
            return toNum(b) === 0 ? 0 : toNum(a) / toNum(b);
          default:
            return 0;
        }
      }
    }
  };

  const actions = {
    theme: (name: string) => {
      result.style.theme = name;
    },
    color: (hex: string) => {
      result.style.color = hex;
    },
    opacity: (x: number) => {
      result.style.opacity = Math.max(0, Math.min(1, x));
    },
    format: (f: "currency" | "percent" | "compact") => {
      result.style.format = f;
    },
    watermark: (on: boolean) => {
      result.style.watermark = !!on;
    },
    highlight: (x: number) => {
      // v0: only last() supported; use last() to decide
      // We store a generic highlight; UI can map it.
      result.style.highlights?.push({ kind: "last" });
    },
    badge: (txt: string) => {
      result.style.badges?.push(txt);
    },
    alert: (msg: string, rule: string) => {
      result.events.push({ type: "alert", message: msg, rule });
    },
    log: (msg: string, rule: string) => {
      result.events.push({ type: "log", message: msg, rule });
    },
  };

  for (const r of program.rules) {
    const ok = toBool(evalExpr(r.when));
    if (!ok) continue;

    for (const a of r.actions) {
      if (a.k !== "call") continue;
      const name = a.name;

      const argVals = a.args.map(evalExpr);

      if (name === "alert") {
        actions.alert(toStr(argVals[0] ?? ""), r.name);
        continue;
      }
      if (name === "log") {
        actions.log(toStr(argVals[0] ?? ""), r.name);
        continue;
      }

      const fn = (actions as any)[name];
      if (typeof fn === "function") fn(...argVals);
    }
  }

  return result;
              }
