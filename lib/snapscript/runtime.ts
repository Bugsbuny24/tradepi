// lib/snapscript/runtime.ts
// SnapScript v0: cell/calc/watch + basic arithmetic expressions
// parse -> AST -> dependency graph -> reactive propagation

type Token =
  | { t: "kw"; v: "cell" | "calc" | "watch" }
  | { t: "id"; v: string }
  | { t: "num"; v: number }
  | { t: "op"; v: "+" | "-" | "*" | "/" | "=" | "(" | ")" }
  | { t: "nl" }
  | { t: "eof" };

type Stmt =
  | { kind: "cell"; name: string; expr: Expr }
  | { kind: "calc"; name: string; expr: Expr }
  | { kind: "watch"; name: string };

type Expr =
  | { kind: "num"; value: number }
  | { kind: "ref"; name: string }
  | { kind: "bin"; op: "+" | "-" | "*" | "/"; left: Expr; right: Expr };

function isIdStart(c: string) {
  return /[A-Za-z_]/.test(c);
}
function isId(c: string) {
  return /[A-Za-z0-9_]/.test(c);
}

export function tokenize(input: string): Token[] {
  const s = input.replace(/\r\n/g, "\n");
  const out: Token[] = [];
  let i = 0;

  const pushNL = () => {
    // collapse multiple newlines
    if (out.length === 0 || out[out.length - 1].t !== "nl") out.push({ t: "nl" });
  };

  while (i < s.length) {
    const c = s[i];

    if (c === " " || c === "\t") {
      i++;
      continue;
    }
    if (c === "\n") {
      i++;
      pushNL();
      continue;
    }
    if (c === "#") {
      // comment till end of line
      while (i < s.length && s[i] !== "\n") i++;
      continue;
    }

    // numbers
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const raw = s.slice(i, j);
      const num = Number(raw);
      if (!Number.isFinite(num)) throw new Error(`Invalid number: ${raw}`);
      out.push({ t: "num", v: num });
      i = j;
      continue;
    }

    // identifiers / keywords
    if (isIdStart(c)) {
      let j = i;
      while (j < s.length && isId(s[j])) j++;
      const raw = s.slice(i, j);
      if (raw === "cell" || raw === "calc" || raw === "watch") {
        out.push({ t: "kw", v: raw });
      } else {
        out.push({ t: "id", v: raw });
      }
      i = j;
      continue;
    }

    // operators
    if ("+-*/=()".includes(c)) {
      out.push({ t: "op", v: c as any });
      i++;
      continue;
    }

    throw new Error(`Unexpected char: "${c}" at ${i}`);
  }

  out.push({ t: "nl" });
  out.push({ t: "eof" });
  return out;
}

class Parser {
  private idx = 0;
  constructor(private toks: Token[]) {}

  private peek(): Token {
    return this.toks[this.idx];
  }
  private next(): Token {
    return this.toks[this.idx++];
  }
  private expect<T extends Token["t"]>(t: T): Extract<Token, { t: T }> {
    const tok = this.next();
    if (tok.t !== t) throw new Error(`Expected ${t} got ${tok.t}`);
    return tok as any;
  }
  private eatNL() {
    while (this.peek().t === "nl") this.next();
  }

  parseProgram(): Stmt[] {
    const out: Stmt[] = [];
    this.eatNL();
    while (this.peek().t !== "eof") {
      out.push(this.parseStmt());
      this.eatNL();
    }
    return out;
  }

  private parseStmt(): Stmt {
    const tok = this.peek();
    if (tok.t !== "kw") throw new Error(`Expected statement keyword, got ${tok.t}`);

    if (tok.v === "cell" || tok.v === "calc") {
      const kw = this.next() as Extract<Token, { t: "kw" }>;
      const name = this.expect("id").v;
      this.expect("op"); // "="
      // ensure it's '='
      const eq = this.toks[this.idx - 1] as any;
      if (eq.v !== "=") throw new Error(`Expected '=', got ${eq.v}`);

      const expr = this.parseExpr();
      return { kind: kw.v, name, expr } as any;
    }

    if (tok.v === "watch") {
      this.next();
      const name = this.expect("id").v;
      return { kind: "watch", name };
    }

    throw new Error(`Unknown keyword: ${(tok as any).v}`);
  }

  // Expr grammar:
  // expr -> term (('+'|'-') term)*
  // term -> factor (('*'|'/') factor)*
  // factor -> num | id | '(' expr ')'
  private parseExpr(): Expr {
    let node = this.parseTerm();
    while (this.peek().t === "op" && (this.peek() as any).v && ["+", "-"].includes((this.peek() as any).v)) {
      const op = (this.next() as any).v as "+" | "-";
      const right = this.parseTerm();
      node = { kind: "bin", op, left: node, right };
    }
    return node;
  }

  private parseTerm(): Expr {
    let node = this.parseFactor();
    while (this.peek().t === "op" && (this.peek() as any).v && ["*", "/"].includes((this.peek() as any).v)) {
      const op = (this.next() as any).v as "*" | "/";
      const right = this.parseFactor();
      node = { kind: "bin", op, left: node, right };
    }
    return node;
  }

  private parseFactor(): Expr {
    const tok = this.peek();
    if (tok.t === "num") {
      this.next();
      return { kind: "num", value: tok.v };
    }
    if (tok.t === "id") {
      this.next();
      return { kind: "ref", name: tok.v };
    }
    if (tok.t === "op" && tok.v === "(") {
      this.next();
      const inner = this.parseExpr();
      const close = this.expect("op");
      if (close.v !== ")") throw new Error(`Expected ')', got ${close.v}`);
      return inner;
    }
    throw new Error(`Unexpected token in expr: ${tok.t}`);
  }
}

function collectDeps(expr: Expr, deps = new Set<string>()): Set<string> {
  if (expr.kind === "ref") deps.add(expr.name);
  if (expr.kind === "bin") {
    collectDeps(expr.left, deps);
    collectDeps(expr.right, deps);
  }
  return deps;
}

function evalExpr(expr: Expr, get: (name: string) => number): number {
  switch (expr.kind) {
    case "num":
      return expr.value;
    case "ref":
      return get(expr.name);
    case "bin": {
      const a = evalExpr(expr.left, get);
      const b = evalExpr(expr.right, get);
      switch (expr.op) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "*":
          return a * b;
        case "/":
          return b === 0 ? NaN : a / b;
      }
    }
  }
}

type NodeType = "cell" | "calc";

type Node = {
  type: NodeType;
  name: string;
  expr?: Expr;             // calc has expr
  value: number;           // current numeric value
  deps: Set<string>;       // calc dependencies
  watchers: Set<(v: number) => void>;
};

export class SnapRuntime {
  private nodes = new Map<string, Node>();
  private revDeps = new Map<string, Set<string>>(); // who depends on me

  defineCell(name: string, initial: number) {
    const n: Node = {
      type: "cell",
      name,
      value: initial,
      deps: new Set(),
      watchers: new Set(),
    };
    this.nodes.set(name, n);
  }

  defineCalc(name: string, expr: Expr) {
    const deps = collectDeps(expr);
    const n: Node = {
      type: "calc",
      name,
      expr,
      value: 0,
      deps,
      watchers: new Set(),
    };
    this.nodes.set(name, n);

    // reverse deps map
    for (const d of deps) {
      if (!this.revDeps.has(d)) this.revDeps.set(d, new Set());
      this.revDeps.get(d)!.add(name);
    }
  }

  watch(name: string, fn: (v: number) => void) {
    const node = this.nodes.get(name);
    if (!node) throw new Error(`watch: unknown node ${name}`);
    node.watchers.add(fn);
    // initial emit
    fn(node.value);
    return () => node.watchers.delete(fn);
  }

  get(name: string): number {
    const node = this.nodes.get(name);
    if (!node) return 0;
    return node.value;
  }

  set(name: string, value: number) {
    const node = this.nodes.get(name);
    if (!node) throw new Error(`set: unknown cell ${name}`);
    if (node.type !== "cell") throw new Error(`set: ${name} is not a cell`);
    node.value = value;
    this.emit(name);
    this.propagateFrom([name]);
  }

  private emit(name: string) {
    const node = this.nodes.get(name);
    if (!node) return;
    for (const w of node.watchers) w(node.value);
  }

  private recompute(name: string) {
    const node = this.nodes.get(name);
    if (!node || node.type !== "calc" || !node.expr) return;

    const next = evalExpr(node.expr, (n) => this.get(n));
    node.value = next;
    this.emit(name);
  }

  private propagateFrom(queue: string[]) {
    const seen = new Set<string>();
    while (queue.length) {
      const changed = queue.shift()!;
      const dependents = this.revDeps.get(changed);
      if (!dependents) continue;

      for (const dep of dependents) {
        if (seen.has(dep)) continue;
        seen.add(dep);
        this.recompute(dep);
        queue.push(dep);
      }
    }
  }

  // initial compute for all calcs (topology-lite; loop-safe for MVP)
  computeAll() {
    // do a few passes to settle (since MVP)
    for (let pass = 0; pass < 3; pass++) {
      for (const [name, node] of this.nodes) {
        if (node.type === "calc") this.recompute(name);
      }
    }
  }
}

export function compileSnapScript(source: string) {
  const toks = tokenize(source);
  const parser = new Parser(toks);
  const prog = parser.parseProgram();

  const rt = new SnapRuntime();

  // first pass: define cells with initial value
  for (const st of prog) {
    if (st.kind === "cell") {
      // evaluate initial expression with empty context => only numbers allowed for now
      const init = evalExpr(st.expr, () => 0);
      rt.defineCell(st.name, init);
    }
  }

  // second: define calcs (may reference cells/calcs)
  for (const st of prog) {
    if (st.kind === "calc") {
      rt.defineCalc(st.name, st.expr);
    }
  }

  // settle
  rt.computeAll();

  return { runtime: rt, program: prog };
    }
