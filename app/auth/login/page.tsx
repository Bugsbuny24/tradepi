import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Suspense
        fallback={
          <div className="text-sm text-gray-500">Login yükleniyor…</div>
        }
      >
        <LoginClient />
      </Suspense>
    </div>
  );
}
