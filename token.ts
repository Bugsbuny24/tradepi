import crypto from "crypto";

export function tokenPrefix(token: string) {
  return token.slice(0, 10);
}

export function tokenHashSha256(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
