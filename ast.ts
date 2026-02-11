export type Expr =
  | { k: "num"; v: number }
  | { k: "str"; v: string }
  | { k: "id"; v: string }
  | { k: "call"; name: string; args: Expr[] }
  | { k: "unary"; op: "not" | "-"; rhs: Expr }
  | { k: "bin"; op: string; lhs: Expr; rhs: Expr };

export type Action =
  | { k: "call"; name: string; args: Expr[] };

export type Rule = {
  name: string;
  when: Expr;
  actions: Action[];
};

export type Program = {
  rules: Rule[];
};
