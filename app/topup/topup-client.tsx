// app/topup/topup-client.tsx
"use client";

import { useMemo, useState } from "react";

export default function TopupClient({
  packages,
  disabled,
}: {
  packages: Array<{ code: string; title: string; price_pi: number }>;
  disabled: boolean;
}) {
  const [pkg, setPkg] = useState(packages?.[0]?.code ?? "");
  const [txid, setTxid] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(() => packages.find((p) => p.code === pkg), [packages, pkg]);

  async function submit() {
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/purchases/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          package_code: pkg,
          amount_pi: selected?.price_pi ?? 0,
          txid,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      setMsg(`Gönderildi ✅ intent_id: ${json.intent_id}`);
      setTxid("");
    } catch (e: any) {
      setMsg(`Hata: ${e?.message ?? "Unknown"}`);
    } finally {
      setLoading(false);
    }
  }

  const payLink = useMemo(() => {
    const code = encodeURIComponent(pkg || "");
    const ret = encodeURIComponent("/dashboard");
    return `/pi/pay?code=${code}&return=${ret}`;
  }, [pkg]);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <label className="text-sm font-semibold">Paket</label>
      <select
        className="mt-2 w-full rounded-lg border p-2"
        value={pkg}
        onChange={(e) => setPkg(e.target.value)}
        disabled={disabled}
      >
        {packages.map((p) => (
          <option key={p.code} value={p.code}>
            {p.title} — {p.price_pi} PI
          </option>
        ))}
      </select>

      <label className="mt-4 block text-sm font-semibold">TXID (manuel)</label>
      <input
        className="mt-2 w-full rounded-lg border p-2"
        placeholder="Ödeme işlem ID / referans"
        value={txid}
        onChange={(e) => setTxid(e.target.value)}
        disabled={disabled}
      />

      <button
        onClick={submit}
        disabled={disabled || loading || !pkg || !txid}
        className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Gönderiliyor..." : "Topup Gönder (manuel)"}
      </button>

      {/* Otomatik ödeme linki */}
      <a
        href={payLink}
        className={`mt-3 block w-full rounded-lg border px-4 py-2 text-center text-sm font-semibold ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
      >
        Pi Browser ile Otomatik Öde
      </a>

      {msg && <div className="mt-3 text-sm">{msg}</div>}
    </div>
  );
}
