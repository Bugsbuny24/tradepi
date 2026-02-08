export type Token =
  | { t: "id"; v: string }
  | { t: "num"; v: number }
  | { t: "str"; v: string }
  | { t: "op"; v: string }
  | { t: "punc"; v: string }
  | { t: "kw"; v: string }
  | { t: "eof" };

const KW = new Set(["rule", "when", "and", "or", "not"]);

export function tokenize(input: string): Token[] {
  const s = input;
  const out: Token[] = [];
  let i = 0;

  const isWS = (c: string) => /\s/.test(c);
  const isIdStart = (c: string) => /[A-Za-z_]/.test(c);
  const isId = (c: string) => /[A-Za-z0-9_]/.test(c);
  const isNum = (c: string) => /[0-9]/.test(c);

  const peek = () => s[i] ?? "";
  const next = () => s[i++] ?? "";

  while (i < s.length) {
    const c = peek();
    if (isWS(c)) {
      i++;
      continue;
    }

    // comments: // ...
    if (c === "/" && s[i + 1] === "/") {
      while (i < s.length && s[i] !== "\n") i++;
      continue;
    }

    // strings: "..."
    if (c === '"') {
      i++;
      let buf = "";
      while (i < s.length) {
        const ch = next();
        if (ch === '"') break;
        if (ch === "\\") {
          const esc = next();
          buf += esc === "n" ? "\n" : esc === "t" ? "\t" : esc;
        } else {
          buf += ch;
        }
      }
      out.push({ t: "str", v: buf });
      continue;
    }

    // numbers
    if (isNum(c) || (c === "." && isNum(s[i + 1] ?? ""))) {
      let buf = "";
      while (i < s.length && (isNum(peek()) || peek() === ".")) buf += next();
      out.push({ t: "num", v: Number(buf) });
      continue;
    }

    // identifiers / keywords
    if (isIdStart(c)) {
      let buf = "";
      while (i < s.length && isId(peek())) buf += next();
      if (KW.has(buf)) out.push({ t: "kw", v: buf });
      else out.push({ t: "id", v: buf });
      continue;
    }

    // two-char ops
    const two = s.slice(i, i + 2);
    if (["==", "!=", ">=", "<="].includes(two)) {
      out.push({ t: "op", v: two });
      i += 2;
      continue;
    }

    // one-char ops / punctuation
    if (["+", "-", "*", "/", ">", "<", "(", ")", "{", "}", ",", ";"].includes(c)) {
      const kind = ["(", ")", "{", "}", ",", ";"].includes(c) ? "punc" : "op";
      out.push({ t: kind as any, v: c });
      i++;
      continue;
    }

    throw new Error(`Unexpected char '${c}' at ${i}`);
  }

  out.push({ t: "eof" });
  return out;
  }
