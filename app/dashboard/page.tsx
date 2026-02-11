import { cookies } from "next/headers";
import TestPiPaymentButton from "./TestPiPaymentButton";

export default function DashboardPage() {
  const c = cookies();
  const piUsername = c.get("pi_username")?.value || null;

  return (
    <div className="min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-black">Dashboard</h1>

      <p className="text-sm text-gray-400">
        Pi User: <span className="font-bold text-white">{piUsername || "—"}</span>
      </p>

      <TestPiPaymentButton />
    </div>
  );
}
