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
      <div className="grid grid-cols-1 gap-4">
        {packages.map((p: any) => (
          <div 
            key={p.code}
            onClick={() => !disabled && setPkg(p.code)}
            className={`group cursor-pointer rounded-[24px] border-2 p-6 transition-all ${
              pkg === p.code ? "border-yellow-500 bg-yellow-500/5 shadow-[0_0_30px_-10px_rgba(251,191,36,0.2)]" : "border-white/5 bg-[#050505] hover:border-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-black uppercase italic ${pkg === p.code ? "text-yellow-500" : "text-white"}`}>{p.title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-600 mt-1 italic group-hover:text-gray-400 transition-colors">Digital Asset Access</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono font-bold text-white leading-none">{p.price_pi}</span>
                <span className="ml-2 text-[10px] font-black text-yellow-500 uppercase tracking-tighter">PI</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[32px] border border-white/5 bg-[#050505] p-8 shadow-inner">
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700">İşlem Kanıtı / TXID</label>
        <input
          className="mt-3 w-full rounded-2xl border border-white/5 bg-black p-4 text-white outline-none focus:border-yellow-500/30 transition-all font-mono text-sm placeholder:text-gray-800"
          placeholder="Pi Network İşlem Kodunu Yapıştırın"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          disabled={disabled || loading}
        />
        
        <button
          onClick={submit}
          disabled={disabled || loading || !txid}
          className="mt-6 w-full rounded-2xl bg-yellow-500 py-5 text-[11px] font-black uppercase text-black transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-10 shadow-xl shadow-yellow-500/10 tracking-widest"
        >
          {loading ? "AĞ DOĞRULANIYOR..." : "KOTA YÜKLEMESİNİ BAŞLAT"}
        </button>

        {msg && (
          <div className={`mt-6 rounded-2xl p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] ${msg.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}
