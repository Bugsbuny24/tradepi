"use client";
import { useMemo, useState } from "react";

export default function TopupClient({ packages, disabled }: any) {
  const [pkg, setPkg] = useState(packages?.[0]?.code ?? "");
  const [txid, setTxid] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<any>(null);

  const selected = useMemo(() => packages.find((p: any) => p.code === pkg), [packages, pkg]);

  async function submit() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/purchases/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ package_code: pkg, amount_pi: selected?.price_pi ?? 0, txid }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Hata oluştu");
      setMsg({ type: "success", text: `İşlem Başarılı! ID: ${json.intent_id}` });
      setTxid("");
    } catch (e: any) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Paket Seçimi */}
      <div className="grid grid-cols-1 gap-4">
        {packages.map((p: any) => (
          <div 
            key={p.code}
            onClick={() => !disabled && setPkg(p.code)}
            className={`cursor-pointer rounded-[24px] border-2 p-6 transition-all ${
              pkg === p.code ? "border-yellow-500 bg-yellow-500/5 shadow-[0_0_30px_-10px_rgba(251,191,36,0.2)]" : "border-white/5 bg-[#050505] hover:border-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-black uppercase italic ${pkg === p.code ? "text-yellow-500" : "text-white"}`}>{p.title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Sınırsız Veri Köprüsü</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono font-bold text-white">{p.price_pi}</span>
                <span className="ml-2 text-xs font-bold text-yellow-500">PI</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ödeme Girişi */}
      <div className="rounded-[32px] border border-white/5 bg-[#050505] p-8">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">İşlem Kanıtı (TXID)</label>
        <input
          className="mt-3 w-full rounded-2xl border border-white/5 bg-black p-4 text-white outline-none focus:border-yellow-500/50 transition-all font-mono text-sm"
          placeholder="Pi Network İşlem Hash Kodunu Girin"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          disabled={disabled || loading}
        />
        
        <button
          onClick={submit}
          disabled={disabled || loading || !txid}
          className="mt-6 w-full rounded-2xl bg-yellow-500 py-4 text-xs font-black uppercase text-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-20 shadow-lg shadow-yellow-500/10"
        >
          {loading ? "DOĞRULANIYOR..." : "ÖDEMEYİ ONAYLA"}
        </button>

        {msg && (
          <div className={`mt-4 rounded-xl p-4 text-center text-[10px] font-bold uppercase tracking-widest ${msg.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}
