import { Token } from "./tokenize";
import { Action, Expr, Program, Rule } from "./ast";

export function parse(tokens: Token[]): Program {
  let i = 0;

  const peek = () => tokens[i];
  const next = () => tokens[i++];

  const expect = (t: Token["t"], v?: string) => {
    const tok = next();
    if (tok.t !== t) throw new Error(`Expected ${t}, got ${tok.t}`);
    if (v && (tok as any).v !== v) throw new Error(`Expected '${v}', got '${(tok as any).v}'`);
    return tok as any;
  };

  const match = (t: Token["t"], v?: string) => {
    const tok = peek();
    if (!tok) return false;
    if (tok.t !== t) return false;
    if (v && (tok as any).v !== v) return false;
    i++;
    return true;
  };

  // Pratt-ish expression parsing
  const prec: Record<string, number> = {
    or: 1,
    and: 2,
    "==": 3,
    "!=": 3,
    ">": 4,
    "<": 4,
    ">=": 4,
    "<=": 4,
    "+": 5,
    "-": 5,
    "*": 6,
    "/": 6,
  };

  const parsePrimary = (): Expr => {
    const tok = peek();
    if (tok.t === "num") {
      next();
      return { k: "num", v: (tok as any).v };
    }
    if (tok.t === "str") {
      next();
      return { k: "str", v: (tok as any).v };
    }
    if (tok.t === "id") {
      next();
      const name = (tok as any).v as string;
      if (match("punc", "(")) {
        const args: Expr[] = [];
        if (!match("punc", ")")) {
          do {
            args.push(parseExpr(0));
          } while (match("punc", ","));
          expect("punc", ")");
        }
        return { k: "call", name, args };
      }
      return { k: "id", v: name };
    }
    if (match("punc", "(")) {
      const e = parseExpr(0);
      expect("punc", ")");
      return e;
    }
    throw new Error(`Unexpected token: ${tok.t}`);
  };

  const parseUnary = (): Expr => {
    const tok = peek();
    if (tok.t === "kw" && (tok as any).v === "not") {
      next();
      return { k: "unary", op: "not", rhs: parseUnary() };
    }
    if (tok.t === "op" && (tok as any).v === "-") {
      next();
      return { k: "unary", op: "-", rhs: parseUnary() };
    }
    return parsePrimary();
  };

  const parseExpr = (minPrec: number): Expr => {
    let lhs = parseUnary();

    while (true) {
      const tok = peek();
      if (!tok) break;

      let op: string | null = null;

      if (tok.t === "kw" && ((tok as any).v === "and" || (tok as any).v === "or")) {
        op = (tok as any).v;
      } else if (tok.t === "op") {
        op = (tok as any).v;
      }

      if (!op) break;

      const p = prec[op];
      if (!p || p < minPrec) break;

      next(); // consume op
      const rhs = parseExpr(p + 1);
      lhs = { k: "bin", op, lhs, rhs };
    }

    return lhs;
  };

  const parseAction = (): Action => {
    const id = expect("id").v as string;
    expect("punc", "(");
    const args: Expr[] = [];
    if (!match("punc", ")")) {
      do {
        args.push(parseExpr(0));
      } while (match("punc", ","));
      expect("punc", ")");
    }
    match("punc", ";"); // optional
    return { k: "call", name: id, args };
  };

  const parseRule = (): Rule => {
    expect("kw", "rule");
    const nameTok = expect("str");
    expect("kw", "when");
    const when = parseExpr(0);
    expect("punc", "{");
    const actions: Action[] = [];
    while (!match("punc", "}")) {
      actions.push(parseAction());
    }
    return { name: nameTok.v as string, when, actions };
  };

  const rules: Rule[] = [];
  while (peek().t !== "eof") {
    rules.push(parseRule());
  }
  return { rules };
  }
