// app/pi/pay/page.tsx
import { Suspense } from "react";
import PiPayClient from "./pi-pay-client";

export const dynamic = "force-dynamic";

export default function PiPayPage({
  searchParams,
}: {
  searchParams: { code?: string; return?: string };
}) {
  const code = (searchParams.code ?? "").trim();
  const rawReturn = (searchParams.return ?? "/dashboard").trim();

  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <PiPayClient code={code} rawReturn={rawReturn} />
    </Suspense>
  );
}
