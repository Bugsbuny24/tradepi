import Link from "next/link";

type Quotas = {
  embed_view_remaining: number;
  api_call_remaining: number;
  widget_load_remaining: number;
  watermark_off_views_remaining: number;
  human_task_remaining: number;
  human_minute_remaining: number;
};

function fmt(n: number) {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("tr-TR");
}

export default function BalanceCard({
  planTitle,
  planCode,
  quotas,
}: {
  planTitle: string;
  planCode: string;
  quotas: Quotas;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-gray-500">Mevcut Paket</div>
          <div className="text-xl font-bold">{planTitle}</div>
          <div className="mt-1 text-xs text-gray-500">Kod: {planCode}</div>
        </div>

        <Link
          href="/topup"
          className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Kredi Yükle
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">Embed View</div>
          <div className="text-lg font-bold">{fmt(quotas.embed_view_remaining)}</div>
        </div>
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">API Call</div>
          <div className="text-lg font-bold">{fmt(quotas.api_call_remaining)}</div>
        </div>
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">Widget Load</div>
          <div className="text-lg font-bold">{fmt(quotas.widget_load_remaining)}</div>
        </div>
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">No Watermark View</div>
          <div className="text-lg font-bold">{fmt(quotas.watermark_off_views_remaining)}</div>
        </div>
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">Human Tasks</div>
          <div className="text-lg font-bold">{fmt(quotas.human_task_remaining)}</div>
        </div>
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">Human Minutes</div>
          <div className="text-lg font-bold">{fmt(quotas.human_minute_remaining)}</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Add-on’lar: Remove Branding / Extra Storage / Real-Time Push gibi ekstraları da burada gösteririz.
      </div>
    </div>
  );
}
