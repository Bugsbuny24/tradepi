### app/api/dev/route.ts
```ts
// app/api/dev/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true });
}
