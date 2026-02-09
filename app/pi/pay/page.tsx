import PiPayClient from "./pi-pay-client";

export default function Page({
  searchParams,
}: {
  searchParams?: { code?: string; rawReturn?: string };
}) {
  const code = searchParams?.code || "";
  const rawReturn = searchParams?.rawReturn;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Pi Payment</h1>
      <PiPayClient code={code} rawReturn={rawReturn} />
    </div>
  );
}
