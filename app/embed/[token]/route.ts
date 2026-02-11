import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { token: string } }) {
  // Simple embed stub
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>SnapLogic Embed</title>
</head>
<body>
  <div style="font-family: ui-sans-serif; padding: 20px;">
    <h2>SnapLogic Embed</h2>
    <p>Token: <b>${params.token}</b></p>
    <p>This is a placeholder embed page.</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
